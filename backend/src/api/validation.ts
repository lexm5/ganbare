import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors';

/**
 * バリデーションルールの型
 */
type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

/**
 * フィールドバリデータ
 */
export class FieldValidator<T> {
  private rules: ValidationRule<T>[] = [];

  required(message: string = '必須項目です'): this {
    this.rules.push({
      validate: (value) => value !== undefined && value !== null && value !== '',
      message,
    });
    return this;
  }

  min(minValue: number, message?: string): this {
    this.rules.push({
      validate: (value) => {
        if (typeof value === 'string') return value.length >= minValue;
        if (typeof value === 'number') return value >= minValue;
        return true;
      },
      message: message || `${minValue}以上で入力してください`,
    });
    return this;
  }

  max(maxValue: number, message?: string): this {
    this.rules.push({
      validate: (value) => {
        if (typeof value === 'string') return value.length <= maxValue;
        if (typeof value === 'number') return value <= maxValue;
        return true;
      },
      message: message || `${maxValue}以下で入力してください`,
    });
    return this;
  }

  pattern(regex: RegExp, message: string = '形式が正しくありません'): this {
    this.rules.push({
      validate: (value) => typeof value === 'string' && regex.test(value),
      message,
    });
    return this;
  }

  enum<E>(values: E[], message?: string): this {
    this.rules.push({
      validate: (value) => values.includes(value as unknown as E),
      message: message || `次のいずれかを指定してください: ${values.join(', ')}`,
    });
    return this;
  }

  custom(validate: (value: T) => boolean, message: string): this {
    this.rules.push({ validate, message });
    return this;
  }

  validate(value: T): string[] {
    const errors: string[] = [];
    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }
    return errors;
  }
}

/**
 * バリデーションスキーマの型
 */
type ValidationSchema = Record<string, FieldValidator<unknown>>;

/**
 * リクエストボディをバリデート
 */
export const validateBody = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    for (const [field, validator] of Object.entries(schema)) {
      const value = req.body[field];
      const fieldErrors = validator.validate(value);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('入力内容に誤りがあります', errors);
    }

    next();
  };
};

/**
 * 便利なバリデータ作成関数
 */
export const v = {
  string: () => new FieldValidator<string>(),
  number: () => new FieldValidator<number>(),
  boolean: () => new FieldValidator<boolean>(),
  any: <T>() => new FieldValidator<T>(),
};

/**
 * よく使うバリデーションパターン
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
};
