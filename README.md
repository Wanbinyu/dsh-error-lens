# dsh-error-lens

[English](README.en.md) | 简体中文

> 非官方社区插件，与 DeepSeek 官方无隶属或背书关系。

为 DeepSeek Harness Web 提供只读、脱敏的模型请求错误诊断。插件把模糊的“本轮运行失败”整理成可操作的信息，并可复制一份适合提交到 GitHub Discussions 的诊断报告。

![dsh-error-lens 在 DeepSeek Harness 中显示网络错误诊断](https://raw.githubusercontent.com/Wanbinyu/dsh-error-lens/main/docs/images/dsh-error-lens.png)

## 为什么需要它

第三方 OpenAI 兼容网关经常用相似的界面返回不同问题：

- `401`：密钥无效或未配置；
- `403`：密钥可能有效，但 User-Agent、模型权限或网关策略拒绝请求；
- `429`：请求过快或额度限流；
- `400`：模型名称、developer role、tool calls 或推理参数不兼容；
- `5xx`、超时和连接错误：供应商或网络异常。

Error Lens 会保留状态码、错误码、请求 ID、供应商和模型，同时在数据进入浏览器前尝试移除 API Key、Bearer Token、URL 密钥参数和用户目录。

## 功能

- 在消息输入区上方显示最近一次仍未恢复的请求失败；
- 区分身份验证、禁止访问、限流、上下文超限、兼容性、超时、网络和服务端错误；
- 展示 DSH 已持久化的供应商错误消息与 Request ID；
- 一键复制中英文脱敏诊断报告；
- 成功完成下一轮后自动隐藏提示，但保留有限的会话内错误统计；
- 不读取凭据存储，不保存完整提示词，不自动重试，不修改模型请求；
- 基于官方 session projection 与 Web UI slot，无 DOM 注入。

## 安装

要求 Node.js `>=22.19` 和 DeepSeek Harness `0.1.0-rc.6` 或更高版本。

```bash
dsh plugin --profile web add https://github.com/Wanbinyu/dsh-error-lens/archive/refs/tags/v0.1.0.tar.gz
```

安装或更新后重启：

```bash
dsh web
```

卸载：

```bash
dsh plugin --profile web remove dsh-error-lens
```

## 配置

默认配置位于 Web profile 的 `cordis.patch.yml`：

```yaml
- insert:
    - id: error-lens
      name: dsh-error-lens
      config:
        maxRecords: 10
        maxMessageLength: 2000
```

| 选项 | 默认值 | 说明 |
| --- | ---: | --- |
| `maxRecords` | `10` | 每个会话投影保留的最近错误数量，范围 1-50 |
| `maxMessageLength` | `2000` | 单条脱敏错误的最大字符数，范围 256-8000 |

## 隐私边界

插件只处理 DSH 会话日志中已经存在的终止失败记录。复制或公开报告前仍应人工检查，因为任何基于文本规则的脱敏都无法保证覆盖供应商自定义错误中的所有敏感格式。

插件不会：

- 读取 `settings.yaml` 中的密钥；
- 记录请求正文或完整提示词；
- 向外部服务发送遥测；
- 自动更改配置、重试或切换模型。

## 开发

```bash
npm install
npm run verify
```

`verify` 会执行 Host/Web 类型检查、单元测试、客户端构建和安装包内容检查。

## 反馈

问题与建议请提交到 [GitHub Issues](https://github.com/Wanbinyu/dsh-error-lens/issues)。报告问题前请使用插件的复制按钮生成脱敏诊断，并再次人工检查其中是否含有不希望公开的信息。

## 许可证

[MIT](LICENSE)
