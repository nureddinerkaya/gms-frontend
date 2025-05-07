import React, {useState, useEffect} from "react";
import {Form, Input, Button, Checkbox, Typography} from "antd";
import {useAuth} from "./AuthContext";
import {useNavigate} from "react-router-dom";
import "../css/Login.css";

const {Title} = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const {login, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await login(values.username, values.password);
            if (response) {
                navigate("/home")
            } else {
                navigate("/")
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login Error: ", error);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Login Failed:", errorInfo);
    };

    return (
        <div className="body">
            <div className="container">
                <Title level={3} className="title">Login</Title>
                <Form
                    name="login"
                    layout="vertical"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {required: true, message: "Please enter your username!"},
                            {type: "string", message: "Please enter a valid username!"},
                        ]}
                    >
                        <Input placeholder="Enter your username"/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true, message: "Please enter your password!"}]}
                    >
                        <Input.Password placeholder="Enter your password"/>
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember Me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="login-button"
                            loading={loading}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <div className="login-link">
                    <a href="/register">Don't have an account? Sign Up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;