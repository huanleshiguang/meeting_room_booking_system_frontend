import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCallback, useEffect } from "react";
import "./update_info.css";
import { useNavigate } from "react-router-dom";
import { fetchInfo, updateInfo, updateInfoCaptcha } from "../../../interface/interface";
export interface UserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export function UpdateInfo() {
  const [form] = useForm();
  const navigate = useNavigate();

  // 获取用户信息并回显到表单
  // seEffect 是 React 中最重要且常用的 Hook 之一，它的核心作用是 在组件渲染后执行副作用操作
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const res = await fetchInfo(); // 调用获取信息的接口
        if (res.status === 200 || res.status === 201) {
          form.setFieldsValue({
            headPic: res.data.data.headPic,
            nickName: res.data.data.nickName,
            email: res.data.data.email,
          });
        } else {
          message.error(res.data.message || "获取用户信息失败");
        }
      } catch (error) {
        message.error("请求失败，请稍后重试");
        console.error("获取用户信息出错:", error);
      }
    };

    loadUserInfo();
  }, []);

  const onFinish = useCallback(async (values: UserInfo) => {
    const res = await updateInfo(values);

    if(res.status === 201 || res.status === 200) {
        const { message: msg, data} = res.data;
        if(msg === 'success') {
            message.success('用户信息更新成功');
        } else {
            message.error(data);
        }
    } else {
        message.error('系统繁忙，请稍后再试');
    }
}, []);

  async function sendCaptcha() {
    const address = form.getFieldValue("email");
    if (!address) {
      return message.error("请输入邮箱地址");
    }

    const res = await updateInfoCaptcha(address);
    if (res.status === 201 || res.status === 200) {
      message.success(res.data.data);
    } else {
      message.error(res.data.data || "系统繁忙，请稍后再试");
    }
  }

  return (
    <div id="updateInfo-container">
      <Form
        form={form}
        {...layout1}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="头像"
          name="headPic"
          rules={[{ required: true, message: "请输入头像!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "请输入昵称!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            { type: "email", message: "请输入合法邮箱地址!" },
          ]}
        >
          <Input disabled={true} />
        </Form.Item>

        <div className="captcha-wrapper">
          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div>

        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
