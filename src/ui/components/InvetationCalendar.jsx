import React, { useState } from 'react';
import { 
  Calendar, 
  Badge, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  List, 
  Checkbox, 
  Tag, 
  Typography,
  TimePicker,
  Divider,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { locale } from '../utils/config';

const { Title, Text } = Typography;
const { TextArea } = Input;

const InvitationCalendar = () => {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  const onSelect = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a'
    };
    return colors[priority] || '#d9d9d9';
  };

  const getPriorityTag = (priority) => {
    const config = {
      high: { color: 'red', text: 'HAUTE' },
      medium: { color: 'orange', text: 'MOYENNE' },
      low: { color: 'green', text: 'FAIBLE' }
    };
    return config[priority] || { color: 'default', text: 'NORMALE' };
  };

  const dateCellRender = (date) => {
    const dateKey = formatDate(date);
    const dayTasks = tasks[dateKey] || [];
    
    return (
      <div style={{ minHeight: '60px', padding: '2px' }}>
        {dayTasks.slice(0, 3).map(task => (
          <div key={task.id} style={{ marginBottom: '2px' }}>
            <Badge
              status={task.completed ? 'success' : 'processing'}
              color={task.completed ? '#52c41a' : getPriorityColor(task.priority)}
              text={
                <span 
                  style={{ 
                    fontSize: '11px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1,
                    maxWidth: '80px',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {task.title}
                </span>
              }
            />
          </div>
        ))}
        {dayTasks.length > 3 && (
          <Text type="secondary" style={{ fontSize: '10px' }}>
            +{dayTasks.length - 3} de plus
          </Text>
        )}
      </div>
    );
  };

  const addTask = (values) => {
    if (!selectedDate) return;

    const dateKey = formatDate(selectedDate);
    const task = {
      id: Date.now(),
      title: values.title,
      time: values.time ? dayjs(values.time).format('HH:mm') : null,
      priority: values.priority || 'medium',
      description: values.description || '',
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), task]
    }));

    form.resetFields();
  };

  const toggleTask = (dateKey, taskId) => {
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (dateKey, taskId) => {
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(task => task.id !== taskId)
    }));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedDate(null);
    form.resetFields();
  };

  const currentDateTasks = selectedDate ? tasks[formatDate(selectedDate)] || [] : [];

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <Title level={4} style={{ margin: 0, color: '#262626' }}>
            Calendrier
          </Title>
          <Text type="secondary">
            Cliquez sur une date pour gérer les tâches
          </Text>
        </div>

        <Calendar
        // showWeek={true}
        // mode={'year'}
          locale={locale}
          onSelect={onSelect}
          dateCellRender={dateCellRender}
          style={{ 
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}
        />

        <Modal
          title={
            <Title level={5} style={{ margin: 0 }}>
              Tâches du {selectedDate ? selectedDate.format('D MMMM YYYY') : ''}
            </Title>
          }
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={600}
          bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          {currentDateTasks.length > 0 && (
            <>
              <Title level={5}>Tâches existantes</Title>
              <List
                dataSource={currentDateTasks}
                renderItem={task => (
                  <List.Item
                    style={{ 
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                      paddingLeft: '16px',
                      marginBottom: '8px',
                      background: task.completed ? '#f6ffed' : '#fafafa',
                      borderRadius: '6px'
                    }}
                    actions={[
                      <Popconfirm
                        title="Supprimer cette tâche ?"
                        onConfirm={() => deleteTask(formatDate(selectedDate), task.id)}
                        okText="Oui"
                        cancelText="Non"
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          size="small"
                        />
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Checkbox
                          checked={task.completed}
                          onChange={() => toggleTask(formatDate(selectedDate), task.id)}
                        />
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            style={{ 
                              textDecoration: task.completed ? 'line-through' : 'none',
                              opacity: task.completed ? 0.6 : 1 
                            }}
                          >
                            {task.title}
                          </span>
                          <Tag {...getPriorityTag(task.priority)} size="small">
                            {getPriorityTag(task.priority).text}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          {task.time && (
                            <div style={{ marginBottom: '4px' }}>
                              <ClockCircleOutlined style={{ marginRight: '4px' }} />
                              <Text type="secondary">{task.time}</Text>
                            </div>
                          )}
                          {task.description && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {task.description}
                            </Text>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
                style={{ marginBottom: '24px' }}
              />
              <Divider />
            </>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Titre de la tâche *
              </label>
              <Input 
                placeholder="Saisir le titre"
                prefix={<CheckCircleOutlined />}
                value={form.getFieldValue('title') || ''}
                onChange={(e) => form.setFieldsValue({ title: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  Heure
                </label>
                <TimePicker 
                  format="HH:mm"
                  placeholder="Choisir l'heure"
                  style={{ width: '100%' }}
                  value={form.getFieldValue('time')}
                  onChange={(time) => form.setFieldsValue({ time })}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  Priorité
                </label>
                <Select 
                  placeholder="Choisir la priorité"
                  style={{ width: '100%' }}
                  value={form.getFieldValue('priority') || 'medium'}
                  onChange={(priority) => form.setFieldsValue({ priority })}
                >
                  <Select.Option value="low">
                    <Tag color="green">Faible</Tag>
                  </Select.Option>
                  <Select.Option value="medium">
                    <Tag color="orange">Moyenne</Tag>
                  </Select.Option>
                  <Select.Option value="high">
                    <Tag color="red">Haute</Tag>
                  </Select.Option>
                </Select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Description (optionnelle)
              </label>
              <TextArea 
                rows={2}
                placeholder="Saisir une description"
                maxLength={200}
                showCount
                value={form.getFieldValue('description') || ''}
                onChange={(e) => form.setFieldsValue({ description: e.target.value })}
              />
            </div>

            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              block
              size="large"
              onClick={() => {
                const values = form.getFieldsValue();
                if (values.title?.trim()) {
                  addTask(values);
                }
              }}
              disabled={!form.getFieldValue('title')?.trim()}
            >
              Ajouter une invitation
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default InvitationCalendar;
