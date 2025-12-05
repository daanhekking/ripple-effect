'use client';

import { Layout, Button, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <AntHeader style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text strong style={{ fontSize: 18, marginRight: 8 }}>The Ripple Effect</Text>
            </div>

            <Space>
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                >
                    Sign Out
                </Button>
            </Space>
        </AntHeader>
    );
}
