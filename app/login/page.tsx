'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, App } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { login } from '@/lib/actions';
// We use useFormStatus from react-dom which is available in Nextjs 14+ (this is Next 16 so ok)
// But for Ant Design form onFinish, we need to bridge it.

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = React.useState(false);
    const { message } = App.useApp();

    const onFinish = async (values: { email: string; token: string; remember: boolean }) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('token', values.token);
        if (values.remember) formData.append('remember', 'on');

        try {
            const result = await login(formData); // This will redirect if successful
            if (result && result.error) {
                message.error(result.error);
                setLoading(false);
            }
        } catch {
            message.error("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f7f6f2 0%, #eef2f8 100%)'
        }}>
            <Card style={{ width: 400, padding: 24, textAlign: 'center' }} variant="borderless">
                <Title level={2} style={{ color: '#2f3a3d', marginBottom: 8 }}>The Ripple Effect</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>Nurture each ripple of growth</Text>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="token"
                        rules={[{ required: true, message: 'Please input your access token!' }]}
                    >
                        <Input.Password prefix={<KeyOutlined />} placeholder="Personal Token" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" style={{ textAlign: 'left' }}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading} style={{ backgroundColor: '#5a7ec4', height: 48, fontSize: 16 }}>
                            Sign In
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text type="secondary">
                            Don't have an account?{' '}
                            <a href="/signup" style={{ color: '#5a7ec4', fontWeight: 600 }}>
                                Sign up
                            </a>
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
