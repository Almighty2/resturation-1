"use client"
import { useEffect, useRef, useState } from "react"
import { DeleteOutlined, EditOutlined, EyeOutlined, PictureOutlined, SearchOutlined } from '@ant-design/icons';
import { Space, Table, Col, Divider, Row, Button, Image } from 'antd';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Input from "@/app/ui/form/Input";
import Link from "next/link";
import { FaToggleOn } from "react-icons/fa";


export default function ListeSupplements(){
    const [supplements, setSupplement] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {
      formState: { errors }, setValue, watch
    } = useForm();
    const router = useRouter();

    const token = localStorage.getItem("jwtToken");
  
    const handleEdit = (idplat) => {
      router.push(`/dashboard/supplements/edit/idrestaurant${id}/dishes/${idplat}`);
    };
  
    const uploadImage = (idplat) => {
      router.push(`/dashboard/supplements/upload/idrestaurant${id}/dishes/${idplat}`);
    };
  
    const handleStatut = (idplat) => {
      router.push(`/dashboard/supplements/statut/idrestaurant${id}/dishes/${idplat}`);
    };
  
    const handleView = (idplat) => {
      router.push(`/dashboard/supplements/view/idrestaurant${id}/dishes/${idplat}`);
    };
    
    let categoriesOptions = [];
    
    if (Array.isArray(categories) && categories.length > 0) {
        categoriesOptions = (categories).map(item => ({
          value: item.id,
          label: item.nom
        }));
    }


    console.log('supplements ', supplements)
    
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
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1677ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open) {
            if (open) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

      const columns = [
        {
          title: 'nom',
          dataIndex: 'nom',
          key: 'nom',
          ...getColumnSearchProps('nom'),
          sorter: (a, b) => a.nom.length - b.nom.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'image',
          dataIndex: 'image',
          key: 'image',
          render: (image, record) => {
            const recordId = record.id || record.idmenu || record._id; // Assure-toi d'utiliser le bon identifiant
      
            if (image && image.url) {
              return (
                <Image
                  key={recordId} // Utilisation de la bonne clé
                  src={image.url}
                  alt="Image du plat"
                  width={100}
                  height={100}
                />
              );
            }
            return (
                <Button
                  key={`view-${recordId}`}
                  type="primary"
                  icon={<PictureOutlined />}
                  onClick={() => uploadImage(recordId)}                  
                />
            );
          },
        },
        {
          title: 'description',
          dataIndex: 'description',
          key: 'description',
          ...getColumnSearchProps('description'),
          sorter: (a, b) => a.description.length - b.description.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'prix',
          dataIndex: 'prix',
          key: 'prix',
          ...getColumnSearchProps('prix'),
          sorter: (a, b) => a.prix.length - b.prix.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_, record) => {
            const recordId = record.id || record.idmenu || record._id; // Identifier correctement l'ID
      
            return (
              <Space key={`actions-${recordId}`} size="middle">
                <Button
                  key={`edit-${recordId}`}
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(recordId)}
                />
                <Button
                  key={`view-${recordId}`}
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(recordId)}
                />
                <Button
                  key={`toggle-${recordId}`}
                  type="primary"
                  icon={<FaToggleOn />}
                  onClick={() => handleStatut(recordId)}
                />
              </Space>
            );
          },
        },
      ];
      

    const getSupplements = async()=> {
        setLoading(true)
        const response = await fetch(`/api/restaurant/${id}/supplements`,{
            headers: {
               'Authorization': `Bearer ${token}`, 
                'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
                'Content-Type': 'application/json', // Spécifier le type de contenu
            }
        });
        if (!response.ok) {
            setLoading(false)
            throw new Error(`Erreur: ${response.status}`);
        }
        setLoading(false)
        const data= await response.json();
        setSupplement(data.items);
    }


    useEffect(()=>{
        getSupplements();
    },[])


    return (
      <>
          {isLoading ? (
              <p>Chargement...</p>
          ) : (
            <>
              <div className="">
                  <Row wrap={false}>
                    <Col flex="auto"></Col>
                    <Col flex="none">
                      <div style={{ padding: '0 16px' }}>
                          <Link href="/dashboard/supplements/creer" passHref>
                            <Button type="primary">Créer un plat</Button>
                          </Link>
                      </div>
                    </Col>
                  </Row>
                  <Divider orientation="left"></Divider>
                  <Table columns={columns} dataSource={supplements} />
              </div>
            </>
          )}
      </>
    )
}