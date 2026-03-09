import { AbstractControl, ValidationErrors } from '@angular/forms';

export function usernameEmailPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  if (!value) return { required: true };

  // Regex email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex phone VN (10 số)
  const phoneRegex = /^(0|\+84)\d{9}$/;

  // Regex username (3–20 ký tự, không dấu, không khoảng trắng)
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;

  const isEmail = emailRegex.test(value);
  const isPhone = phoneRegex.test(value);
  const isUsername = usernameRegex.test(value);

  return isEmail || isPhone || isUsername ? null : { invalidFormat: true };
}
