import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Oauth2() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    // Đăng ký có thể tự xử lý dựa vào new_user trường hợp này chỉ làm người dùng đăng nhập
    // const new_user = params.get("new_user");
    // const verify = params.get("verify");

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    navigate("/chat");
  }, [params, navigate]);

  return <div>Login</div>;
}
