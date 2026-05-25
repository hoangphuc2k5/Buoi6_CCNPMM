import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  forgotPasswordApi,
  verifyForgotPasswordOtpApi,
  resetPasswordApi
} from "../util/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("request");
  const [localError, setLocalError] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalMessage("");
    if (!email) {
      setLocalError("Vui long nhap email.");
      return;
    }
    setLoadingRequest(true);
    const res = await forgotPasswordApi(email);
    if (res?.EC === 0) {
      setStep("verify");
      setOtpHint(res?.DT?.otp || "");
      setLocalMessage(res?.EM || "Da gui OTP.");
    } else {
      setLocalError(res?.EM || "Khong the gui OTP.");
    }
    setLoadingRequest(false);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalMessage("");
    if (!otp) {
      setLocalError("Vui long nhap OTP.");
      return;
    }
    setLoadingVerify(true);
    const res = await verifyForgotPasswordOtpApi(email, otp);
    if (res?.EC === 0) {
      setStep("reset");
      setLocalMessage(res?.EM || "OTP hop le.");
    } else {
      setLocalError(res?.EM || "OTP khong dung.");
    }
    setLoadingVerify(false);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalMessage("");
    if (!newPassword) {
      setLocalError("Vui long nhap mat khau moi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("Mat khau xac nhan khong khop.");
      return;
    }
    setLoadingReset(true);
    const res = await resetPasswordApi(email, otp, newPassword);
    if (res?.EC === 0) {
      setStep("done");
      setLocalMessage(res?.EM || "Doi mat khau thanh cong.");
    } else {
      setLocalError(res?.EM || "Khong the doi mat khau.");
    }
    setLoadingReset(false);
  };

  const handleSubmit = (event) => {
    if (step === "request") {
      return handleRequestOtp(event);
    }
    if (step === "verify") {
      return handleVerifyOtp(event);
    }
    return handleResetPassword(event);
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để nhận hướng dẫn khôi phục. Chúng tôi sẽ kiểm tra tài khoản và phản hồi ngay."
      footer={
        <span>
          Bạn đã nhớ mật khẩu?{" "}
          <Link className="text-reef hover:text-ink" to="/login">
            Đăng nhập
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
        />
        {step !== "request" ? (
          <Input
            label="OTP"
            name="otp"
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="Nhap ma OTP"
          />
        ) : null}
        {step === "reset" ? (
          <>
            <Input
              label="Mat khau moi"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Nhap mat khau moi"
            />
            <Input
              label="Xac nhan mat khau"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Nhap lai mat khau"
            />
          </>
        ) : null}
        {localError ? (
          <div className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">
            {localError}
          </div>
        ) : null}
        {localMessage ? (
          <div className="rounded-2xl border border-reef/30 bg-reef/10 px-4 py-3 text-sm text-reef">
            {localMessage}
          </div>

        
        ) : null}
        <div className="flex flex-wrap gap-3">
          {step === "request" ? (
            <Button type="submit" loading={loadingRequest} className="w-full">
              Gui OTP
            </Button>
          ) : null}
          {step === "verify" ? (
            <Button type="submit" loading={loadingVerify} className="w-full">
              Xac nhan OTP
            </Button>
          ) : null}
          {step === "reset" ? (
            <Button type="submit" loading={loadingReset} className="w-full">
              Dat lai mat khau
            </Button>
          ) : null}
          {step === "done" ? (
            <Link to="/login" className="w-full">
              <Button className="w-full">Dang nhap</Button>
            </Link>
          ) : null}
          <Link to="/" className="w-full">
            <Button variant="ghost" className="w-full">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
