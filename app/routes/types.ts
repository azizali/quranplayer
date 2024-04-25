type Brand<K, T> = K & { __brand: T };
export type Track = Brand<string, "Track">;
