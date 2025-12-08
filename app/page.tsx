import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Typography, Row, Col, Space } from 'antd';
import QuestionCard from '@/components/QuestionCard';
import Header from '@/components/Header';

const { Title, Text } = Typography;

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch active questions
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('id, text')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
  }

  const email = user.email;

  return (
    <>
      <Header />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <header style={{ marginBottom: 48, textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Title level={2} style={{ margin: 0 }}>Welcome back</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>{email}</Text>
          </Space>
        </header>

        <section>
          <div style={{ marginBottom: 24 }}>
            <Title level={3}>Your Reflections</Title>
            <Text type="secondary">Your answers stay private until you choose to share them.</Text>
          </div>

          <Row gutter={[0, 16]}>
            {questions?.map((q) => (
              <Col span={24} key={q.id}>
                <QuestionCard id={q.id} text={q.text} />
              </Col>
            ))}
            {(!questions || questions.length === 0) && (
              <Text>No active questions at the moment.</Text>
            )}
          </Row>
        </section>
      </div>
    </>
  );
}
