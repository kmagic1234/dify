from typing import Optional

from core.workflow.nodes.base_node import BaseNode


class LLMNode(BaseNode):
    @classmethod
    def get_default_config(cls, filters: Optional[dict] = None) -> dict:
        """
        Get default config of node.
        :param filters: filter by node config parameters.
        :return:
        """
        return {
            "type": "llm",
            "config": {
                "prompt_templates": {
                    "chat_model": {
                        "prompts": [
                            {
                                "role": "system",
                                "text": "You are a helpful AI assistant."
                            }
                        ]
                    },
                    "completion_model": {
                        "conversation_histories_role": {
                            "user_prefix": "Human",
                            "assistant_prefix": "Assistant"
                        },
                        "prompt": {
                            "text": "Here is the chat histories between human and assistant, inside "
                                    "<histories></histories> XML tags.\n\n<histories>\n{{"
                                    "#histories#}}\n</histories>\n\n\nHuman: {{#query#}}\n\nAssistant:"
                        },
                        "stop": ["Human:"]
                    }
                }
            }
        }
