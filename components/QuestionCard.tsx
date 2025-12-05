'use client';

import React, { useState } from 'react';
import { Card, Typography, Modal, Input, Button, App } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { submitReflection } from '@/lib/reflection-actions';

const { Title } = Typography;
const { TextArea } = Input;

interface QuestionProps {
    id: string; // Add ID prop
    text: string;
}

export default function QuestionCard({ id, text }: QuestionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (!answer.trim()) {
            message.warning('Please write something before submitting.');
            return;
        }

        setLoading(true);
        try {
            const result = await submitReflection(id, answer);
            if (result && result.error) {
                message.error(result.error);
            } else {
                message.success('Reflection saved!');
                setIsModalOpen(false);
                setAnswer(''); // Clear or keep? Maybe better to clear.
            }
        } catch {
            message.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Card
                hoverable
                onClick={showModal}
                style={{
                    marginBottom: 16,
                    borderRadius: 14,
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                actions={[
                    <EditOutlined key="answer" />
                ]}
            >
                <Title level={4} style={{ margin: 0, fontWeight: 500, color: '#2f3a3d' }}>
                    {text}
                </Title>
                <Typography.Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                    Tap to answer
                </Typography.Text>
            </Card>

            <Modal
                title="Reflect"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="Save Reflection"
                okButtonProps={{ style: { backgroundColor: '#5a7ec4' } }}
            >
                <Typography.Paragraph strong style={{ fontSize: 16 }}>{text}</Typography.Paragraph>
                <TextArea
                    rows={6}
                    placeholder="Type your thoughts here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    style={{ borderRadius: 8, padding: 12 }}
                />
            </Modal>
        </>
    );
}
