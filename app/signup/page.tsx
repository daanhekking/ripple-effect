'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { signup } from '@/lib/auth-actions';

const { Title, Text } = Typography;

export default function SignupPage() {
    const [loading, setLoading] = useState(false);

    const handleSignup = async (values: { email: string; password: string; name: string }) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('name', values.name || '');

        try {
            const result = await signup(formData);

            if (result?.error) {
                message.error(result.error);
                setLoading(false);
            }
            // If no error, the redirect will happen automatically
        } catch (error) {
            // NEXT_REDIRECT is not an error - it's how Next.js handles redirects
            // Only log actual errors
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                console.error('Signup error:', error);
                message.error('An unexpected error occurred during signup');
                setLoading(false);
            }
            // If it's NEXT_REDIRECT, let it propagate (don't set loading to false)
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 450,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    borderRadius: '16px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ marginBottom: '8px', color: '#667eea' }}>
                        Create Account
                    </Title>
                    <Text type="secondary">Join Ripple Effect today</Text>
                </div>

                <Form
                    name="signup"
                    onFinish={handleSignup}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[
                            { required: true, message: 'Please enter your name' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="John Doe"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="you@example.com"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="••••••••"
                            size="large"
                        />

                    </Form.Item>

                    <Form.Item style={{ marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: 600
                            }}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">
                            Already have an account?{' '}
                            <Link href="/login" style={{ color: '#667eea', fontWeight: 600 }}>
                                Sign in
                            </Link>
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
