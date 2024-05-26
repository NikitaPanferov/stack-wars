import React from "react";
import { Layout, Button, Tooltip, Tag } from "antd";
import {
  GithubOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

export const AppLayout: React.FC = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ background: "#fff", textAlign: "center", padding: "0 20px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Tooltip title="Home">
              <Button type="text" icon={<HomeOutlined />} href="/" />
            </Tooltip>
            <Tooltip title="Config">
              <Button type="text" icon={<SettingOutlined />} href="/config" />
            </Tooltip>
          </div>
          <Tag
            color="geekblue"
            style={{
              fontSize: "2rem",
              height: "3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 2rem",
            }}
          >
            STACK WARS
          </Tag>
          <div />
        </div>
      </Header>
      <Content style={{ padding: "30px 40px" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>
        <a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubOutlined style={{ fontSize: "24px" }} />
        </a>
      </Footer>
    </Layout>
  );
};
