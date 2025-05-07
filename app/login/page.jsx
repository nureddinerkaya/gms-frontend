"use client"

import React, {useState, useEffect} from "react";
import {Form, Input, Button, Checkbox, Typography} from "antd";
import {useRouter} from "next/navigation"; // Replaced next/router with next/navigation
import "./page.css";

const {Title} = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Using Next.js router from next/navigation

    useEffect(() => {
        // Removed user check
    }, []); // Removed dependencies related to user

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('https://silent-space-458820-h2.oa.r.appspot.com/api/users/getAll');
            const users = await response.json();

            const user = users.find(u => u.username === values.username && u.password === values.password);
            console.log(user);
            if (user) {
                localStorage.setItem('user_id', user.id);
                router.push("/user"); // Redirect to user page
            } else {
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