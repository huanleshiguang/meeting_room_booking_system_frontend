import { Button, DatePicker, Form, FormProps, Input, message } from "antd";
import "./login.css";
import { login } from "../../interface/interface";
import { Link, useNavigate } from "react-router-dom";
interface LoginUser {
  username: string;
  password: string;
}

const layout1 = {
  labelCol: { span: 4 }, // labelColor	标签颜色
  wrapperCol: { span: 20 }, // 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol
};

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

/**
 * colon 为 false 是去掉 label 后的冒号
 * @returns
 */
export function Login() {
  const navigate = useNavigate();
  const onFinish: FormProps<LoginUser>["onFinish"] = async (values) => {
    const res = await login(values.username, values.password);

    const { code, message: msg, data } = res.data;
    if (res.status === 201 || res.status === 200) {
      message.success("登录成功");
      setTimeout(() => {
        navigate("/");
      }, 1000);
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_info", JSON.stringify(data.userInfo));
    } else {
      message.error(data || "系统繁忙，请稍后再试");
    }
  };

  return (
    <div id="login-container">
      <h1>会议室预定系统</h1>

      <Form {...layout1} onFinish={onFinish} autoComplete="off" colon={false}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout2}>
          <div className="links">
            <Link to="/register">创建账号</Link>
            <Link to="/update_password">忘记密码</Link>
          </div>
        </Form.Item>

        <Form.Item {...layout2}>
          <Button className="btn" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
