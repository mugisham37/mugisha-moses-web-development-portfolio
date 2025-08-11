import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text here...",
    type: "text",
  },
};

export const Email: Story = {
  args: {
    placeholder: "Enter your email...",
    type: "email",
  },
};

export const Password: Story = {
  args: {
    placeholder: "Enter your password...",
    type: "password",
  },
};

export const Number: Story = {
  args: {
    placeholder: "Enter a number...",
    type: "number",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "This input is disabled",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: "This input has a value",
    readOnly: true,
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider mb-2">
          Name
        </label>
        <Input placeholder="Enter your name" />
      </div>
      
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider mb-2">
          Email
        </label>
        <Input type="email" placeholder="Enter your email" />
      </div>
      
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider mb-2">
          Password
        </label>
        <Input type="password" placeholder="Enter your password" />
      </div>
      
      <div>
        <label className="block text-sm font-mono uppercase tracking-wider mb-2">
          Phone
        </label>
        <Input type="tel" placeholder="Enter your phone number" />
      </div>
    </div>
  ),
};