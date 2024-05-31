import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Config, ForcesConfig } from "../types";
import {
  Slider,
  InputNumber,
  Button,
  Form,
  Row,
  Col,
  Card,
  Collapse,
  Typography,
  Spin,
  Flex,
} from "antd";
import { fetchConfig, saveConfig } from "../api";

const { Panel } = Collapse;

export const ConfigPage = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<Config>("config", fetchConfig);
  const mutation = useMutation(saveConfig, {
    onSuccess: () => {
      queryClient.invalidateQueries("config");
    },
  });

  const [config, setConfig] = useState<Config | null>(null);

  const handleSliderChange = (
    key: string,
    value: number,
    unitType: keyof ForcesConfig,
    unitName: keyof ForcesConfig["alliance"]
  ) => {
    if (config) {
      const newConfig = {
        ...config,
        forces: {
          ...config.forces,
          [unitType]: {
            ...config.forces[unitType],
            [unitName]: {
              ...config.forces[unitType][unitName],
              [key]: value,
            },
          },
        },
      };
      setConfig(newConfig);
    }
  };

  const handleCapitalChange = (value: number | null) => {
    if (config && !!value) {
      setConfig({ ...config, capital: value });
    }
  };

  const handleLineCountChange = (value: number | null) => {
    if (config && !!value) {
      setConfig({ ...config, line_count: value });
    }
  };

  const handleSave = () => {
    if (config) {
      mutation.mutate(config);
    }
  };

  useEffect(() => {
    if (data) {
      setConfig(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center">
        <Spin size="large" />
      </Flex>
    );
  }

  if (error) {
    return <div>Error loading config</div>;
  }

  return (
    <Card>
      <Typography.Title>Конфигурация</Typography.Title>
      {config && (
        <Form layout="vertical">
          <Form.Item label="Capital">
            <InputNumber
              min={0}
              value={config.capital}
              onChange={handleCapitalChange}
            />
          </Form.Item>
          <Form.Item label="Line Count">
            <InputNumber
              min={0}
              value={config.line_count}
              onChange={handleLineCountChange}
            />
          </Form.Item>
          <Form.Item>
            <Collapse defaultActiveKey={["1", "2"]}>
              {Object.keys(config.forces).map((unitType) => (
                <Panel
                  header={unitType.charAt(0).toUpperCase() + unitType.slice(1)}
                  key={unitType}
                >
                  {Object.keys(
                    config.forces[unitType as keyof ForcesConfig]
                  ).map((unitName) => (
                    <Card
                      title={
                        unitName.charAt(0).toUpperCase() + unitName.slice(1)
                      }
                      key={unitName}
                      style={{ marginBottom: "20px" }}
                    >
                      {Object.keys(
                        config.forces[unitType as keyof ForcesConfig][
                          unitName as keyof ForcesConfig["alliance"]
                        ]
                      ).map((key) => (
                        <Row key={key} gutter={16}>
                          <Col span={12}>
                            <Form.Item label={key}>
                              <Slider
                                min={0}
                                max={100}
                                onChange={(value) =>
                                  handleSliderChange(
                                    key,
                                    value,
                                    unitType as keyof ForcesConfig,
                                    unitName as keyof ForcesConfig["alliance"]
                                  )
                                }
                                value={
                                  config.forces[unitType as keyof ForcesConfig][
                                    unitName as keyof ForcesConfig["alliance"]
                                  ][key as keyof UnitConfig]
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <InputNumber
                              min={0}
                              max={100}
                              value={
                                config.forces[unitType as keyof ForcesConfig][
                                  unitName as keyof ForcesConfig["alliance"]
                                ][key as keyof UnitConfig]
                              }
                              onChange={(value) =>
                                handleSliderChange(
                                  key,
                                  value as number,
                                  unitType as keyof ForcesConfig,
                                  unitName as keyof ForcesConfig["alliance"]
                                )
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                    </Card>
                  ))}
                </Panel>
              ))}
            </Collapse>
          </Form.Item>
          <Button
            type="primary"
            onClick={handleSave}
            loading={mutation.isLoading}
          >
            Save Config
          </Button>
        </Form>
      )}
    </Card>
  );
};
