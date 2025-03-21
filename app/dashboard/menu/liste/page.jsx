"use client"
import { useEffect, useRef, useState } from "react";
import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Table, Col, Divider, Row, Button, Tooltip } from 'antd';
import { useRouter } from "next/navigation";
import { FaToggleOn } from "react-icons/fa";
import Highlighter from 'react-highlight-words';
import { useForm } from "react-hook-form";
import Input from "@/app/ui/form/Input";
import Link from "next/link";

export default function ListePlats() {
    const [plats, setPlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {
      formState: { errors }
    } = useForm();
   
    const router = useRouter();
    const token = localStorage.getItem("jwtToken");

    const handleEdit = (idmenu) => {
      router.push(`/dashboard/menu/edit/idrestaurant${id}/menu/${idmenu}`);
    };
  
    const handleStatut = (idmenu) => {
      router.push(`/dashboard/menu/statut/idrestaurant${id}/menu/${idmenu}`);
    };
  
    const handleView = (idmenu) => {
      router.push(`/dashboard/menu/view/idrestaurant${id}/menu/${idmenu}`);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small">
                Search
              </Button>
              <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small">
                Reset
              </Button>
              <Button type="link" size="small" onClick={() => close()}>
                Close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''} />
          ) : (
            text
          ),
    });

    const columns = [
        {
          title: 'Nom',
          dataIndex: 'nom',
          key: 'nom',
          width: '70%',
          ...getColumnSearchProps('nom'),
          sorter: (a, b) => a.nom.length - b.nom.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_, record) => (
            <Space key={record.id} size="middle">
              <Tooltip placement="topRight" title='Modifier le menu'>
                <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
              </Tooltip>
              <Tooltip placement="topRight" title='Voir un menu'>
                <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
              </Tooltip>
              <Tooltip placement="topRight" title='Activer/Désactiver un menu'>
                <Button type="primary" icon={<FaToggleOn />} onClick={() => handleStatut(record.id)} />
              </Tooltip>
            </Space>
          ),
        },
    ];

    const getMenu = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/restaurant/${id}/menu`, {
                headers: {
                   'Authorization': `Bearer ${token}`, 
                    'Auth': 'Le programmeur', 
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }
            
            const data = await response.json();
            // Ajout de `key` unique pour éviter les erreurs
            const formattedData = data.items.map(item => ({
                ...item,
                key: item.id,
            }));
            setPlats(formattedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMenu();
    }, []);
  
    return (
      <>
          {isLoading ? (
              <p>Chargement...</p>
          ) : (
            <div>
                <Row wrap={false}>
                    <Col flex="auto"></Col>
                    <Col flex="none">
                      <div style={{ padding: '0 16px' }}>
                          <Link href="/dashboard/menu/creer" passHref>
                            <Button type="primary">Créer un Menu</Button>
                          </Link>
                      </div>
                    </Col>
                </Row>
                <Divider />
                <Table columns={columns} dataSource={plats} loading={loading} />
            </div>
          )}
      </>
    );
}
