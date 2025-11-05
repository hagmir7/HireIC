import React from 'react'
import { Modal, Row, Col, Form, Select, Input, Space, Button } from 'antd'

export default function FilterModal({
  open,
  onCancel,
  onOk,
  filters,
  setFilters,
  levels,
  cities,
  languages,
  categories,
  skills,
}) {
  const handleReset = () => {
    setFilters({})
  }

  return (
    <Modal
      title='Filtrer les CVs'
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key='reset' color="default" variant="dashed" onClick={handleReset}>
          Réinitialiser
        </Button>,
        <Button key='cancel' onClick={onCancel}>
          Annuler
        </Button>,
        <Button  key='ok' type='primary' onClick={onOk}>
          Appliquer
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label='Diplôme'>
            <Select
              placeholder='Diplôme'
              mode='multiple'
              value={filters.levels || undefined}
              onChange={(value) => setFilters({ ...filters, levels: value })}
              className='w-full'
              options={levels}
              showSearch
              optionRender={(option) => (
                <Space>
                  <span>{option.data.label}</span>
                </Space>
              )}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='Ville'>
            <Select
              placeholder='Ville'
              value={filters.city_id || undefined}
              onChange={(value) => setFilters({ ...filters, city_id: value })}
              className='w-full'
              options={cities}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='État'>
            <Select
              placeholder='État'
              value={filters.status || undefined}
              onChange={(value) => setFilters({ ...filters, status: value })}
              className='w-full'
              options={[
                { value: 1, label: 'Nouveau' },
                { value: 2, label: 'Invitation' },
                { value: 3, label: 'Évaluation' },
                { value: 4, label: 'Accepté' },
                { value: 5, label: 'Engagé' },
              ]}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='État civil'>
            <Select
              placeholder='État civil'
              value={filters.marital_status || undefined}
              onChange={(value) =>
                setFilters({ ...filters, marital_status: value })
              }
              className='w-full'
              options={[
                { value: 1, label: 'Célibataire' },
                { value: 2, label: 'Marié(e)' },
                { value: 3, label: 'Veuf/Veuve' },
              ]}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='Langues'>
            <Select
              placeholder='Langues'
              value={filters.language_id || undefined}
              onChange={(value) =>
                setFilters({ ...filters, language_id: value })
              }
              className='w-full'
              options={languages}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='Genre'>
            <Select
              placeholder='Genre'
              value={filters.gender || undefined}
              onChange={(value) => setFilters({ ...filters, gender: value })}
              className='w-full'
              options={[
                { value: 1, label: 'Femelle' },
                { value: 2, label: 'Mâle' },
              ]}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='Catégorie'>
            <Select
              placeholder='Catégorie'
              value={filters.category_id || undefined}
              onChange={(value) =>
                setFilters({ ...filters, category_id: value })
              }
              className='w-full'
              options={categories}
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label='Expérience (Mois)'>
            <Input
              placeholder='Expérience'
              type='number'
              max={1000}
              min={0}
              value={filters.min_experience || ''}
              onChange={(e) =>
                setFilters({ ...filters, min_experience: e.target.value })
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label='Compétences'>
        <Select
          mode='multiple'
          style={{ width: '100%' }}
          placeholder='Compétences'
          value={filters.skills || undefined}
          onChange={(value) => setFilters({ ...filters, skills: value })}
          options={skills}
          optionRender={(option) => (
            <Space>
              <span>{option.data.emoji}</span>
              {option.data.desc}
            </Space>
          )}
        />
      </Form.Item>
    </Modal>
  )
}
