import "./App.css";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import { Input, Menu, Row, Col, Statistic, Spin, Table } from "antd";
import React, { useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import { LoadingOutlined } from "@ant-design/icons";

const { Search } = Input;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
  let [query, setQuery] = useState<string>();
  let [response, setResponse] = useState({
    temp_process: Number(),
    resultados_qtd: Number(),
    query: String(),
    resultados: [],
  });

  const [done, setDone] = useState<boolean>(true);

  let [tempFront, setTempFront] = useState<Number>(0);

  let [atributesF, setAtributes] = useState([
    {
      title: "",
      dataIndex: "",
      key: "",
    },
  ]);

  function handleChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  async function doRequest() {
    setAtributes([
      {
        title: "",
        dataIndex: "",
        key: "",
      },
    ]);

    for (var key in atributesF) {
      delete atributesF[key];
    }

    setDone(false);

    const time = Date.now();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    };

    await fetch("http://127.0.0.1:8080/Selects", requestOptions)
      .then(async (response) => await response.json())
      .then(async (data) => await setResponse(data))
      .then(async () => await setTempFront(Date.now() - time))
      .then(async () => await setDone(true));

    var arrayOfAttributes = [{}];

    response.resultados.forEach((element) => {
      arrayOfAttributes = Object.keys(element);
    });

    arrayOfAttributes.forEach((element) => {
      atributesF.push({
        title: JSON.stringify(element).replace(/"/g, ""),
        dataIndex: JSON.stringify(element).replace(/"/g, ""),
        key: JSON.stringify(element).replace(/"/g, ""),
      });
    });

    console.log(atributesF);
    setAtributes(atributesF);
  }

  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Search
            style={{ marginTop: 15 }}
            placeholder="input search text"
            onChange={handleChangeQuery}
            onSearch={doRequest}
            enterButton
            disabled={!done}
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
          style={{ height: 100 }}
        />
        <Table
          dataSource={response.resultados}
          columns={atributesF}
          loading={!done}
        />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
        <br></br>
        {!done ? <Spin indicator={antIcon} /> : ""}
      </Footer>
    </Layout>
  );
}

export default App;
