export type RgPayErrorConstructorArguments =
  | {
      message: string;
      cause?: Error;
    }
  | string;

export type RgPayErrorConstructor<T extends RgPayError = RgPayError> = new (
  args: RgPayErrorConstructorArguments
) => T;

export class RgPayError extends Error {
  public cause?: Error;

  constructor(args: RgPayErrorConstructorArguments) {
    // Se for string, assume que é a mensagem
    const message = typeof args === 'string' ? args : args.message;
    super(message);

    this.name = new.target.name;
    this.cause = typeof args === 'string' ? undefined : args.cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * @description Gerenciador estático de factories de erros.
 */
export class RgPayErrorFactory {
  private static registry = new Map<string, typeof RgPayError>();

  /**
   * @description Cria uma subclasse de RgPayError
   * @param name Nome da classe de erro
   */
  public static create<T extends string>(name: T) {
    if (this.registry.has(name)) {
      throw new Error(`RgPayError class with name "${name}" already exists`);
    }

    const ErrorClass = class extends RgPayError {
      constructor(args: RgPayErrorConstructorArguments) {
        super(args);
        this.name = name;
      }
    };

    this.registry.set(name, ErrorClass);
    return ErrorClass;
  }

  /**
   * @description Recupera uma classe já registrada
   */
  public static get(name: string) {
    return this.registry.get(name);
  }

  /**
   * @description Lista todos os nomes já registrados
   */
  public static list() {
    return Array.from(this.registry.keys());
  }
}
