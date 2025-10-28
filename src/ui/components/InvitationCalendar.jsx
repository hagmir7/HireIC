import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Badge, Typography, Modal, List, Checkbox, Tag } from 'antd';
import dayjs from 'dayjs';
import { locale } from '../utils/config';
import { api } from '../utils/api'

const { Title, Text } = Typography;

const InvitationCalendar = () => {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

  // Fetch calendar data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const month = dayjs().month() + 1; // 1-12
        const year = dayjs().year();
        const response = await api.get(`calendar?month=${month}&year=${year}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority) => {
    const colors = {
      invitation: '#1890ff',
      evaluation: '#faad14',
      integration: '#52c41a',
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a',
    };
    return colors[priority] || '#d9d9d9';
  };

  const dateCellRender = (date) => {
    const dateKey = formatDate(date);
    const dayTasks = tasks[dateKey] || [];

    return (
      <div className="min-h-[60px] p-1">
        {dayTasks.slice(0, 3).map((task) => (
          <div key={task.id} className="mb-0.5">
            <Badge
              status={task.completed ? 'success' : 'processing'}
              color={task.completed ? '#52c41a' : getPriorityColor(task.priority)}
              text={
                <span
                  className={`text-[11px] inline-block max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap ${
                    task.completed ? 'line-through opacity-60' : ''
                  }`}
                >
                  {task.title}
                </span>
              }
            />
          </div>
        ))}
        {dayTasks.length > 3 && (
          <Text type="secondary" className="text-[10px]">
            +{dayTasks.length - 3} de plus
          </Text>
        )}
      </div>
    );
  };

  const onSelect = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleToggleComplete = (dateKey, id) => {
    setTasks((prev) => {
      const updated = { ...prev };
      updated[dateKey] = updated[dateKey].map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      return updated;
    });
  };

  const dateKey = selectedDate ? formatDate(selectedDate) : null;
  const selectedTasks = dateKey ? tasks[dateKey] || [] : [];

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="!m-0 text-gray-800">
          Calendrier
        </Title>
        <Text type="secondary" className="text-gray-500">
          Cliquez sur une date pour gérer les tâches
        </Text>
      </div>

      {/* Calendar */}
      <Calendar
        locale={locale}
        onSelect={onSelect}
        dateCellRender={dateCellRender}
        className="bg-white rounded-lg border border-gray-200"
      />

      {/* Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span>
              Tâches du {selectedDate ? dayjs(selectedDate).format('DD MMMM YYYY') : ''}
            </span>
            <Tag color="blue">{selectedTasks.length} tâche(s)</Tag>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedTasks.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={selectedTasks}
            renderItem={(task) => (
              <List.Item
                className="border-b border-gray-100 py-2"
                actions={[
                  <Tag color={getPriorityColor(task.priority)} key="priority">
                    {task.priority}
                  </Tag>,
                ]}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(dateKey, task.id)}
                >
                  <span
                    className={`ml-2 ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>
                </Checkbox>
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-6 text-gray-400">Aucune tâche ce jour-là.</div>
        )}
      </Modal>
    </div>
  );
};

export default InvitationCalendar;
