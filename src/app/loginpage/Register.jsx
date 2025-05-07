import React from "react";
import {Form, Input, Button, Checkbox, Typography, message} from "antd";
import "../css/Register.css";
import axios from "axios";
import 'antd/dist/reset.css';

const {Title} = Typography;

const Register = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        handleRegister(values)
    };
    const handleRegister = async (values) => {
        try {
            const response = await axios.post('http://localhost:8000/api/users/add', {
                username: values.name,
                password: values.password,
                total_play_time: 0,
                most_played_game: "Minecraft"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (response.data === "User created successfully") {
                 const userId = response.data.user_id;
                localStorage.setItem("user_id", userId);
                alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            }
        } catch (error) {
            console.error('Kayıt hatası:', error);
            alert('Bir hata oluştu, lütfen tekrar deneyin.');
        }
        form.resetFields();
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Hatalı Kayıt:", errorInfo);
    };
    return (

        <div className="body">
            <div className="container">
                <Title level={3} className="title">
                    Sign Up
                </Title>
                <Form
                    name="register"
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: "Please enter your name!"}]}
                    >
                        <Input placeholder="Your Full Name"/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {required: true, message: "Please enter your password!"},
                            {min: 6, message: "Password must be at least 6 characters."},
                        ]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>

                    {/* Terms & Conditions checkbox */}
                    <Form.Item
                        name="terms"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            new Error("You must accept the terms and conditions!")
                                        ),
                            },
                        ]}
                    >
                        <Checkbox>I accept the terms and conditions.</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="register-button"
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>

                <div className="register-link">
                    <a href="/login">Already have an account? Login</a>
                </div>
            </div>
        </div>
    );
};

export default Register;