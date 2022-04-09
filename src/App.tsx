import React from "react";
import "./App.css";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import { Input, Menu, Row, Col, Statistic, Table, Tag, Space } from "antd";
import { useState } from "react";
import TextArea from "antd/lib/input/TextArea";

const { Search } = Input;

function App() {
  let [query, setQuery] = useState<string>();
  let [response, setResponse] = useState({
    temp_process: Number(),
    resultados_qtd: Number(),
    query: String(),
    resultados: [],
  });

  let [tempFront, setTempFront] = useState<Number>();

  function handleChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function doRequest() {
    const time = Date.now();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ query: query }),
    };

    fetch("http://127.0.0.1:8080/Selects", requestOptions)
      .then((response) => response.json())
      .then((data) => setResponse(data))
      .then(() => setTempFront(Date.now() - time));

    response.resultados.forEach((element) => {
      //console.log(Object.keys(element));
    });
  }

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          style={{
            alignContent: "center",
          }}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
        >
          <Search
            placeholder="input search text"
            onChange={handleChangeQuery}
            onSearch={doRequest}
            enterButton
          />
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Temp.Resp do banco"
              value={response.temp_process + "ms"}
            />
          </Col>
          <Col span={6}>
            <Statistic title="Temp.Resp front" value={tempFront + "ms"} />
          </Col>
          <Col span={6}>
            <Statistic title="Qtd resultados" value={response.resultados_qtd} />
          </Col>
        </Row>
        <TextArea
          value={JSON.stringify(response)}
          size="large"
          style={{ height: 300 }}
        />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default App;
