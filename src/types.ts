export type Status = 'idle' | 'working' | 'blocked';

export type DeptId = 'dev' | 'design' | 'marketing' | 'devops' | 'finance';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export interface Artifact {
  id: string;
  kind: 'image' | 'code' | 'number';
  label: string;
  value: string;
}

export interface Agent {
  id: string;
  dept: DeptId;
  name: string;
  title: string;
  color: string;
  sprite: string;
  status: Status;
  todos: Todo[];
}

export interface Integrations {
  github?: string;
  apple?: boolean;
  instagram?: boolean;
  gmail?: boolean;
}

export interface AppProject {
  id: string;
  name: string;
  floor: number;
  agents: Agent[];
  integrations: Integrations;
}

export type MessageAuthor = 'ceo' | DeptId;

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  kind: 'text' | 'image' | 'file';
  content: string;
  fileName?: string;
  artifact?: Artifact;
  ts: number;
}

export type AgentAction =
  | { type: 'addTodo'; deptId: DeptId; todo: string }
  | { type: 'setStatus'; deptId: DeptId; status: Status }
  | { type: 'postArtifact'; deptId: DeptId; artifact: Artifact };

export interface AgentReply {
  text: string;
  action?: AgentAction;
}
