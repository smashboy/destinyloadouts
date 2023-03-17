import { createContext, useContext } from "react";

export const createContextStore = <T,>(name: string, initialValue?: T) => {
  const Ctx = createContext<T | null>(initialValue || null);

  const useCxt = () => {
    const store = useContext(Ctx);

    if (!store)
      throw new Error(`use${name} must be used within ${name}Provider`);

    return store;
  };

  const Provider: React.FC<{ value: T; children: React.ReactNode }> = ({
    value,
    children,
  }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;

  return [Provider, useCxt] as const;
};
