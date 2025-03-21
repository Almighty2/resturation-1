"use client";

import { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, PictureOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Space, Table, Col, Divider, Row, Button, Image, Tooltip, Input as AntInput } from 'antd'; // Import AntInput
import Highlighter from 'react-highlight-words';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Input from "@/app/ui/form/Input";
import Link from "next/link";
import { FaToggleOn } from "react-icons/fa";

export default function ListePlats() {
    const [plats, setPlats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {
        formState: { errors },
        setValue,
        watch
    } = useForm();
    const router = useRouter();
    
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;
        
        const getPlats = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/restaurant/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) throw new Error(`Erreur: ${response.status}`);
                
                const data = await response.json();
                setPlats(data.items);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        getPlats();
    }, [id]);
    
    const handleEdit = (idplat) => router.push(`/dashboard/plats/edit/idrestaurant${id}/dishes/${idplat}`);
    const uploadImage = (idplat) => router.push(`/dashboard/plats/upload/idrestaurant${id}/dishes/${idplat}`);
    const handleStatut = (idplat) => router.push(`/dashboard/plats/statut/idrestaurant${id}/dishes/${idplat}`);
    const handleView = (idplat) => router.push(`/dashboard/plats/view/idrestaurant${id}/dishes/${idplat}`);
    
    // Add these missing functions
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
                <AntInput // Use AntInput instead of custom Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button 
                        type="primary" 
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} 
                        icon={<SearchOutlined />} 
                        size="small"
                    >
                        Search
                    </Button>
                    <Button 
                        onClick={() => clearFilters && handleReset(clearFilters)} 
                        size="small"
                    >
                        Reset
                    </Button>
                    <Button 
                        type="link" 
                        size="small" 
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        render: (text) => searchedColumn === dataIndex ? (
            <Highlighter 
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={[searchText]} 
                autoEscape 
                textToHighlight={text ? text.toString() : ''} 
            />
        ) : text,
    });
    
    const columns = [
        { title: 'Nom', dataIndex: 'nom', key: 'nom', ...getColumnSearchProps('nom'), sorter: (a, b) => a.nom.length - b.nom.length },
        { 
            title: 'Image', dataIndex: 'image', key: 'image', 
            render: (image, record) => (
                image?.url ? <Image src={image.url} alt="Image du plat" width={100} height={100} /> :
                <Button type="primary" icon={<PictureOutlined />} onClick={() => uploadImage(record.id)} />
            )
        },
        { title: 'Description', dataIndex: 'description', key: 'description', ...getColumnSearchProps('description'), sorter: (a, b) => a.description.length - b.description.length },
        { title: 'Prix', dataIndex: 'prix', key: 'prix', ...getColumnSearchProps('prix'), sorter: (a, b) => a.prix - b.prix },
        { 
            title: 'Actions', key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title='Modifier'><Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} /></Tooltip>
                    <Tooltip title='Voir'><Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record.id)} /></Tooltip>
                    <Tooltip title='Activer/Désactiver'><Button type="primary" icon={<FaToggleOn />} onClick={() => handleStatut(record.id)} /></Tooltip>
                    <Tooltip title="Changer l'image"><Button type="primary" icon={<UploadOutlined />} onClick={() => uploadImage(record.id)} /></Tooltip>
                </Space>
            )
        },
    ];
    
    return (
        <>
            {isLoading ? <p>Chargement...</p> : (
                <div>
                    <Row wrap={false} justify="end">
                        <Col>
                            <Link href="/dashboard/plats/creer" passHref>
                                <Button type="primary">Créer un plat</Button>
                            </Link>
                        </Col>
                    </Row>
                    <Divider />
                    <Table columns={columns} dataSource={plats} loading={loading} rowKey="id" />
                </div>
            )}
        </>
    );
}