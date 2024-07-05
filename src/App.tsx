import {
  Button,
  Collapse,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Tag,
  Tooltip,
  message,
} from "antd";
import { useCallback, useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";

import img from "./getGlobalAPIKey.png";

export default function App() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [node, setNode] = useState(
    "vless://d342d11e-d424-4583-b36e-524ab1f0afa4@www.visa.com.sg:8880?encryption=none&security=none&type=ws&host=a.srps7gic.workers.dev&path=%2F%3Fed%3D2560#worker节点"
  );
  const [form] = Form.useForm();

  const createWorker = useCallback(async () => {
    setLoading(true);
    try {
      const formData = await form.validateFields();
      console.log(formData);
      const { data } = await axios.post(
        "https://ifenxiang.b4a.app/createWorker",
        formData
      );

      setNode(data.node);
    } catch (error) {}

    setLoading(false);
  }, []);

  return (
    <div className="page">
      <h1>CF worker 自助创建</h1>
      <p>
        需要提供 CloudFlare 账号的 <Tag>邮箱</Tag> 和 <Tag>Global API Key</Tag>{" "}
        <Button type="link" onClick={() => setOpen(true)}>
          如何获取 Global API Key
        </Button>
      </p>

      <Modal
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Image src={img} alt="" />
      </Modal>

      <Form layout="vertical" form={form}>
        <Form.Item
          rules={[
            {
              required: true,
              type: "email",
              message: "请输入 CloudFlare 账号的 邮箱",
            },
          ]}
          label={<Tooltip title="CloudFlare 账号的 邮箱">邮箱</Tooltip>}
          name={"email"}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,

              message: "请输入 CloudFlare 账号的  Global API Key",
            },
          ]}
          label={
            <Tooltip title="CloudFlare 账号的  Global API Key">
              Global API Key
            </Tooltip>
          }
          name={"globalAPIKey"}
        >
          <Input />
        </Form.Item>

        <Collapse
          items={[
            {
              key: "1",
              label: "额外参数",
              children: (
                <>
                  <Form.Item
                    label={
                      <Tooltip title="CloudFlare Worker 的名字">
                        Worker名称
                      </Tooltip>
                    }
                    name={"workerName"}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={<Tooltip title="节点的uuid">uuid</Tooltip>}
                    name={"uuid"}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={<Tooltip title="节点的名字">节点名</Tooltip>}
                    name={"nodeName"}
                  >
                    <Input />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />

        <Button
          style={{ marginTop: 24 }}
          type="primary"
          loading={loading}
          onClick={createWorker}
        >
          创建worker节点
        </Button>
      </Form>

      <p>worker节点地址:</p>

      {node ? (
        <>
          <Space>
            <Button
              type="primary"
              ghost
              href={`clash://install-config/?url=${encodeURIComponent(
                `https://api.2c.lol/sub?target=clash&url=${encodeURIComponent(
                  node
                )}&insert=false`
              )}&name=worker节点`}
            >
              导入到Clash
            </Button>
            <Button
              type="primary"
              danger
              ghost
              href={`shadowrocket://add/sub://${window.btoa(
                `https://api.2c.lol/sub?target=clash&url=${encodeURIComponent(
                  node
                )}&insert=false`
              )}?remark=cf%20worker`}
            >
              导入到小火箭
            </Button>
            <Button type="link" href="https://sub.2c.lol/">
              转换为其他订阅
            </Button>
          </Space>
          <CopyToClipboard
            text={node}
            onCopy={() => {
              message.success("复制成功");
            }}
          >
            <p style={{wordBreak: 'break-all'}}>点击复制: {node}</p>
          </CopyToClipboard>
        </>
      ) : (
        <p>无</p>
      )}
    </div>
  );
}
