"use client"
import { useEffect,useRef, useState } from "react"
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';

export default function ListeCategorie(){
    const id = '28a5e012-bcff-48f5-88e2-baf30a77668a';
    const [categories,setCategories] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

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
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          width: '40%',
          ...getColumnSearchProps('id'),
        },
        {
          title: 'nom',
          dataIndex: 'nom',
          key: 'nom',
          ...getColumnSearchProps('nom'),
          sorter: (a, b) => a.nom.length - b.nom.length,
          sortDirections: ['descend', 'ascend'],
        },
      ];

    const getCategorieByRestaurant = async ()=>{
        setIsLoading(true)
        const reponse = await fetch(`/api/restaurant/${id}/plats/categorie`,{
            headers: {
               // 'Authorization': `Bearer VotreTokenIci`, // Envoyer le token dans l'en-tête Authorization
                'Auth': 'Le programmeur', // Autre en-tête personnalisé si nécessaire
                'Content-Type': 'application/json', // Spécifier le type de contenu
            }
        });

        if(!reponse.ok){
            setIsLoading(false)
            throw new Error(`Erreur: ,${reponse.status}`)
        }
        setIsLoading(false)
        const data = await reponse.json();
        setCategories(data.items);
    }


    console.log(JSON.stringify(categories))
    useEffect(()=>{
        getCategorieByRestaurant();
    },[])
    return (
        <>
            {isLoading ? (
                <p>Chargement...</p>
            ) : (
              <div className="">
                  <Table columns={columns} dataSource={categories} />
              </div>
            )}
        </>
    )
}