import React from 'react'
import { Layout } from 'antd'
import HeaderMain from '../components/common/HeaderMain'
import FooterMain from '../components/common/FooterMain'
import SearchInput from '../components/common/SearchInput'
import AppRouter from '../router/AppRouter'

const { Header, Content, Footer } = Layout

const Home = () => {
    return (
        <Layout className="min-h-screen">
            <Header className="bg-white shadow-lg px-6 sticky top-0 z-50">
                <HeaderMain />
            </Header>
            <SearchInput />

            <Content className="bg-white px-6">
                <AppRouter />
            </Content>

            <Footer className="bg-gray-800 text-center py-2 mt-1">
                <FooterMain />
            </Footer>
        </Layout>
    )
}

export default Home