const LoginPage = () => {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
          Login
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue to TaskFlow.
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
