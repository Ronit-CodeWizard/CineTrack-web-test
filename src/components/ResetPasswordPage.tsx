import React, { useState, useEffect } from 'react';
import { extractRecoverySession, updatePasswordWithRecovery, RecoverySession } from '../lib/supabaseRecovery';
import { getRouteUrl, navigateTo } from '../lib/navigation';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [session, setSession] = useState<RecoverySession | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const recovery = extractRecoverySession();
    setSession(recovery);
  }, []);

  const handleReturnHome = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigateTo('home');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Rule: Minimum 8 characters
    if (newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    // Rule: Validate confirmation
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!session || !session.isValid) {
      setValidationError('Invalid or missing recovery session. Please request a new password recovery email from CineTrack.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updatePasswordWithRecovery(newPassword, session);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setValidationError(result.message || 'Failed to update password. Please try again or request a new link.');
      }
    } catch (err: any) {
      setValidationError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#070709] text-white flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[#1e1e2c] bg-[#0c0c13] p-6 sm:p-8 shadow-2xl">
        {/* Brand header */}
        <div className="text-center mb-8">
          <a
            href={getRouteUrl('home')}
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-extrabold text-sm tracking-tight">
              CT
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              CineTrack
            </span>
          </a>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#7e7e90]">
            Enter a secure new password for your CineTrack account.
          </p>
        </div>

        {/* Invalid or Expired Token Notice if opened without recovery parameters */}
        {session && !session.isValid && !isSuccess && (
          <div className="mb-6 rounded-xl border border-[#3b2024] bg-[#1a0f12] p-4 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#f87171] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">Recovery link required</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#b58b92]">
                  This page is intended for password recovery emails. If your link is expired or missing tokens, open CineTrack on your phone to request a fresh link.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {isSuccess ? (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Password updated successfully.
              </h3>
              <p className="mt-2 text-xs text-[#7e7e90]">
                Your new password has been saved. You can now log into the CineTrack Android app with your updated credentials.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={getRouteUrl('home')}
                onClick={handleReturnHome}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#e4e4eb] active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>BACK TO CINETRACK</span>
              </a>
            </div>
          </div>
        ) : (
          /* Password Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <div className="rounded-lg border border-[#3b2024] bg-[#180f12] p-3 text-xs text-[#f87171] flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-medium text-[#9999ab] mb-1.5"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-[#222230] bg-[#101017] px-3.5 py-3 pr-10 text-sm text-white placeholder-[#505062] outline-none transition-colors focus:border-white disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#656578] hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-medium text-[#9999ab] mb-1.5"
              >
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  minLength={8}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-[#222230] bg-[#101017] px-3.5 py-3 pr-10 text-sm text-white placeholder-[#505062] outline-none transition-colors focus:border-white disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#656578] hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Requirement note */}
            <p className="text-[11px] text-[#606072]">
              Password must be at least 8 characters.
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || (session !== null && !session.isValid)}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-[#e4e4eb] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>UPDATE PASSWORD</span>
                </>
              )}
            </button>

            {/* Back link */}
            <div className="pt-4 text-center border-t border-[#181822]">
              <a
                href={getRouteUrl('home')}
                onClick={handleReturnHome}
                className="inline-flex items-center gap-1.5 text-xs text-[#7e7e90] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>BACK TO CINETRACK</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
