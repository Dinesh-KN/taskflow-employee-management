import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/route.constants';
import {
  clearAuthError,
  resetPasswordChangeState,
} from '@/features/auth/auth.slice';
import { loginUser } from '@/features/auth/auth.thunks';
import { loginSchema } from '@/features/auth/auth.validation';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/error.utils';

import { selectAuthError, selectIsAuthLoading } from '../auth.selectors';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const authError = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectIsAuthLoading);

  const requestedPath = [
    location.state?.from?.pathname,
    location.state?.from?.search,
    location.state?.from?.hash,
  ]
    .filter(Boolean)
    .join('');

  const from =
    requestedPath.startsWith('/') && requestedPath !== ROUTES.LOGIN
      ? requestedPath
      : ROUTES.DASHBOARD;

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(resetPasswordChangeState());
  }, [dispatch]);

  const clearServerError = () => {
    if (authError) {
      dispatch(clearAuthError());
    }
  };

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user;

      toast.success('Welcome back', {
        description: `Signed in as ${user.fullName || user.email}`,
      });

      if (user.mustChangePassword) {
        navigate(ROUTES.CHANGE_PASSWORD, {
          replace: true,
        });
        return;
      }

      navigate(from, {
        replace: true,
      });

      return;
    }

    toast.error('Login failed', {
      description: getErrorMessage(result.payload ?? result.error),
    });
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-9">
        <div className="mb-6 grid size-11 place-items-center rounded-xl border border-border/70 bg-muted/50 text-foreground">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </div>

        <p className="mb-2 text-sm font-medium text-primary">
          TaskFlow workspace
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome back
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Enter the credentials provided by your organization to continue.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>

          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@company.com"
              disabled={isLoading}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(
                'h-12 rounded-xl border-border/70 bg-muted/25 pl-10',
                'transition-[background-color,border-color,box-shadow]',
                'hover:border-border hover:bg-muted/40',
                'focus-visible:border-primary focus-visible:bg-background',
                'aria-invalid:bg-muted/25',
                errors.email &&
                  'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
              )}
              {...register('email', {
                onChange: clearServerError,
              })}
            />
          </div>

          {errors.email ? (
            <p
              id="email-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>

          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isLoading}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={cn(
                'h-12 rounded-xl border-border/70 bg-muted/25 pr-11 pl-10',
                'transition-[background-color,border-color,box-shadow]',
                'hover:border-border hover:bg-muted/40',
                'focus-visible:border-primary focus-visible:bg-background',
                'aria-invalid:bg-muted/25',
                errors.password &&
                  'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
              )}
              {...register('password', {
                onChange: clearServerError,
              })}
            />

            <button
              type="button"
              onClick={() => {
                setShowPassword((currentValue) => !currentValue);
              }}
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className={cn(
                'absolute top-1/2 right-2.5 grid size-8 -translate-y-1/2 place-items-center',
                'rounded-lg text-muted-foreground transition-colors',
                'hover:bg-muted hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password ? (
            <p
              id="password-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {/* Authentication error */}
        {authError ? (
          <div
            role="alert"
            aria-live="assertive"
            className={cn(
              'flex items-start gap-2.5 rounded-xl border px-3.5 py-3',
              'border-destructive/50 bg-destructive/10',
              'text-sm font-medium text-destructive',
            )}
          >
            <ShieldAlert
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />

            <p>{getErrorMessage(authError)}</p>
          </div>
        ) : null}

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-xl font-semibold shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>

        {/* Support message */}
        <p className="border-t border-border/60 pt-5 text-center text-xs leading-5 text-muted-foreground">
          Having trouble signing in? Contact your TaskFlow administrator.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
