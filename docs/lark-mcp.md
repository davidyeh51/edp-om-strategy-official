# Lark MCP 設定

本專案在 `.mcp.json` 中設定了 Lark（國際版）MCP 伺服器 `@larksuiteoapi/lark-mcp`，
啟用 `preset.default` 工具集（訊息、群組、雲文件、多維表格、行事曆等常用功能）。

App ID / App Secret **不寫入 repo**，而是從環境變數讀取：

| 環境變數 | 說明 |
| --- | --- |
| `LARK_APP_ID` | 自建應用的 App ID（`cli_` 開頭） |
| `LARK_APP_SECRET` | 自建應用的 App Secret |

## 1. 建立 Lark 自建應用

1. 登入 [Lark 開放平台](https://open.larksuite.com/app)，點「建立企業自建應用」。
2. 在「憑證與基礎資訊」頁取得 **App ID** 與 **App Secret**。
3. 「新增應用能力」中加入 **機器人（Bot）**，讓應用可收發訊息、加入群組。
4. 「權限管理」中開通需要的權限，例如：
   - 訊息：`im:message`、`im:message:send_as_bot`、`im:chat`
   - 雲文件：`docx:document`、`drive:drive`
   - 多維表格：`bitable:app`
   - 通訊錄（查使用者）：`contact:user.id:readonly`
5. 「版本管理與發佈」建立版本並發佈（需管理員核准）。
6. 若要讀寫特定文件或多維表格，需在該文件的「分享」中把應用加為協作者。

## 2. 設定環境變數

- **Claude Code 雲端環境**：在 session 標題列的雲端環境選單 → Edit，於環境變數加入
  `LARK_APP_ID`、`LARK_APP_SECRET`；同時在 Network access 的 Allowed domains 加入
  `open.larksuite.com`（預設網路政策會擋住此網域）。設定後開新 session 生效。
- **本機**：在 shell 設定檔中 `export LARK_APP_ID=...`、`export LARK_APP_SECRET=...`。

## 3. 驗證

在此 repo 開啟 Claude Code，首次會詢問是否信任專案的 `.mcp.json`，同意後執行 `/mcp`，
應看到 `lark-mcp` 狀態為 connected。
