import { Action, ActionPanel, Color, getPreferenceValues, List, /* showToast, Toast */ } from "@raycast/api";
// import { useFetch } from "@raycast/utils";
import { gitmojis as defaultGitmojis } from "./modules/gitmojis";
// import Style = Toast.Style;

interface PreferenceValues {
  copy: "emoji" | "code" | "entity" | "description-emoji" | "description-code";
  action: "paste" | "copy";
}

type Gitmoji = {
  emoji: string;
  entity: string;
  code: string;
  description: {
    en: string;
    ko: string;
  };
  name: string;
  keywords: string[] | null;
};

const GitmojiList = () => {
  // const { isLoading, data, error } = useFetch<{ gitmojis: Gitmoji[] }>("https://gitmoji.dev/api/gitmojis");

  // if (error) {
  //   showToast({
  //     title: "Failed to fetch latest gitmojis",
  //     message: "Using saved gitmojis as fallback",
  //     style: Style.Failure,
  //   });
  // }
  const isLoading = false;
  const data = { gitmojis: defaultGitmojis };

  return (
    <List searchBarPlaceholder="Search your gitmoji..." isLoading={isLoading}>
      {data?.gitmojis
        ? data.gitmojis.map((gitmoji) => <GitmojiListItem key={gitmoji.name} gitmoji={gitmoji} />)
        : defaultGitmojis.map((gitmoji) => <GitmojiListItem key={gitmoji.name} gitmoji={gitmoji} />)}
    </List>
  );
};

interface GitmojiListItemProps {
  gitmoji: Gitmoji;
}

const GitmojiListItem = ({ gitmoji }: GitmojiListItemProps) => {
  const { name, description: { ko: description }, emoji, code, entity, keywords } = gitmoji;
  const { copy } = getPreferenceValues<PreferenceValues>();

  return (
    <List.Item
      id={name}
      key={name}
      title={description}
      icon={emoji}
      accessories={[{ tag: { value: code, color: Color.Yellow } }]}
      keywords={[code.replace(":", ""), name, ...(keywords || [])]}
      actions={
        <ActionPanel>
          {copy === "emoji" && <PrimaryAction content={emoji} />}
          {copy === "code" && <PrimaryAction content={code} />}
          {copy === "entity" && <PrimaryAction content={entity} />}
          {copy === "description-emoji" && <PrimaryAction content={`${emoji} ${description}`} />}
          {copy === "description-code" && <PrimaryAction content={`${code} ${description}`} />}

          <ActionPanel.Section>
            <Action.CopyToClipboard
              content={emoji}
              title="Copy Emoji"
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={code}
              title="Copy Code"
              shortcut={{ modifiers: ["cmd", "opt"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={entity}
              title="Copy Entity"
              shortcut={{ modifiers: ["cmd", "ctrl"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={`${emoji} ${description}`}
              title="Copy Emoji + Description"
              shortcut={{ modifiers: ["ctrl", "shift"], key: "c" }}
            />
            <Action.CopyToClipboard
              content={`${code} ${description}`}
              title="Copy Code + Description"
              shortcut={{ modifiers: ["ctrl", "opt"], key: "c" }}
            />
          </ActionPanel.Section>

          <ActionPanel.Section>
            <Action.Paste content={emoji} title="Paste Emoji" shortcut={{ modifiers: ["cmd", "shift"], key: "p" }} />
            <Action.Paste content={code} title="Paste Code" shortcut={{ modifiers: ["cmd", "opt"], key: "p" }} />
            <Action.Paste content={entity} title="Paste Entity" shortcut={{ modifiers: ["cmd", "ctrl"], key: "p" }} />
            <Action.Paste
              content={`${emoji} ${description}`}
              title="Paste Emoji + Description"
              shortcut={{ modifiers: ["ctrl", "shift"], key: "p" }}
            />
            <Action.Paste
              content={`${code} ${description}`}
              title="Paste Code + Description"
              shortcut={{ modifiers: ["ctrl", "opt"], key: "p" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

interface PrimaryActionProps {
  content: string;
}

function PrimaryAction({ content }: PrimaryActionProps) {
  const { action } = getPreferenceValues<PreferenceValues>();

  if (action === "copy") {
    return <Action.CopyToClipboard content={content} />;
  } else {
    return <Action.Paste content={content} />;
  }
}

export default GitmojiList;