import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Bell, FileText, CheckCircle } from "lucide-react";

export default function TrackingOilManagement() {
  const [trackingData, setTrackingData] = useState([]);
  const [oilData, setOilData] = useState([]);
  const [alerts, setAlerts] = useState([
    { type: "warning", message: "设备 Code A 需在 2 周内到货" },
    { type: "error", message: "润滑油品牌不匹配，请检查" },
  ]);

  return (
    <div className="p-6">
      <Tabs>
        <TabList>
          <Tab>📋 设备跟踪品</Tab>
          <Tab>🛢️ 润滑油管理</Tab>
          <Tab>⚠️ 预警提醒</Tab>
        </TabList>
        
        <TabPanel>
          <Card>
            <CardHeader>设备清单</CardHeader>
            <CardContent>
              <Input placeholder="搜索设备..." className="mb-4" />
              <Table>
                <Thead>
                  <Tr>
                    <Th>Code</Th>
                    <Th>物品名称</Th>
                    <Th>规格</Th>
                    <Th>状态</Th>
                    <Th>操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {trackingData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.code}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.spec}</Td>
                      <Td>{item.status}</Td>
                      <Td>
                        <Button variant="outline">查看</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel>
          <Card>
            <CardHeader>润滑油管理</CardHeader>
            <CardContent>
              <Input placeholder="搜索润滑油品牌..." className="mb-4" />
              <Table>
                <Thead>
                  <Tr>
                    <Th>品牌</Th>
                    <Th>规格</Th>
                    <Th>到货量</Th>
                    <Th>状态</Th>
                    <Th>操作</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {oilData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.brand}</Td>
                      <Td>{item.spec}</Td>
                      <Td>{item.arrival}</Td>
                      <Td>{item.status}</Td>
                      <Td>
                        <Button variant="outline">详情</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel>
          <Card>
            <CardHeader>预警提醒</CardHeader>
            <CardContent>
              {alerts.map((alert, index) => (
                <Alert key={index} variant={alert.type} className="mb-2">
                  {alert.type === "warning" ? <Bell className="mr-2" /> : <CheckCircle className="mr-2" />}
                  {alert.message}
                </Alert>
              ))}
            </CardContent>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
}
