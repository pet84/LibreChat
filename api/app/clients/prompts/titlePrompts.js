const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require('@langchain/core/prompts');

const langPrompt = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate('Rozpoznejte jazyk použitý v následujícím textu.'),
    HumanMessagePromptTemplate.fromTemplate('{inputText}'),
  ],
  inputVariables: ['inputText'],
});

const createTitlePrompt = ({ convo }) => {
  const titlePrompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        `Napište stručný název pro tuto konverzaci v daném jazyce. Název o 5 slovech nebo méně. Bez interpunkce nebo uvozovek. Musí být v titulkovém formátu, napsaný v daném jazyce.
${convo}`,
      ),
      HumanMessagePromptTemplate.fromTemplate('Jazyk: {language}'),
    ],
    inputVariables: ['language'],
  });

  return titlePrompt;
};

const titleInstruction =
  'stručný název konverzace o 5 slovech nebo méně, ve stejném jazyce, bez interpunkce. Použijte pravidla pro titulkový formát vhodná pro daný jazyk. Nikdy přímo nezmiňujte název jazyka ani slovo "název".';
const titleFunctionPrompt = `V tomto prostředí máte přístup k sadě nástrojů, které můžete použít k vytvoření názvu konverzace.
  
Můžete je volat takto:
<function_calls>
<invoke>
<tool_name>$TOOL_NAME</tool_name>
<parameters>
<$PARAMETER_NAME>$PARAMETER_VALUE</$PARAMETER_NAME>
...
</parameters>
</invoke>
</function_calls>

Zde jsou dostupné nástroje:
<tools>
<tool_description>
<tool_name>submit_title</tool_name>
<description>
Odešlete stručný název v jazyce konverzace, přesně podle popisu parametru.
</description>
<parameters>
<parameter>
<name>title</name>
<type>string</type>
<description>${titleInstruction}</description>
</parameter>
</parameters>
</tool_description>
</tools>`;

const genTranslationPrompt = (
  translationPrompt,
) => `V tomto prostředí máte přístup k sadě nástrojů, které můžete použít k překladu textu.
  
Můžete je volat takto:
<function_calls>
<invoke>
<tool_name>$TOOL_NAME</tool_name>
<parameters>
<$PARAMETER_NAME>$PARAMETER_VALUE</$PARAMETER_NAME>
...
</parameters>
</invoke>
</function_calls>

Zde jsou dostupné nástroje:
<tools>
<tool_description>
<tool_name>submit_translation</tool_name>
<description>
Odešlete překlad v cílovém jazyce, přesně podle popisu parametru a jeho jazyka.
</description>
<parameters>
<parameter>
<name>translation</name>
<type>string</type>
<description>${translationPrompt}
POUZE zahrňte vygenerovaný překlad bez uvozovek ani jeho souvisejícího klíče</description>
</parameter>
</parameters>
</tool_description>
</tools>`;

/**
 * Parses specified parameter from the provided prompt.
 * @param {string} prompt - The prompt containing the desired parameter.
 * @param {string} paramName - The name of the parameter to extract.
 * @returns {string} The parsed parameter's value or a default value if not found.
 */
function parseParamFromPrompt(prompt, paramName) {
  // Handle null/undefined prompt
  if (!prompt) {
    return `No ${paramName} provided`;
  }

  // Try original format first: <title>value</title>
  const simpleRegex = new RegExp(`<${paramName}>(.*?)</${paramName}>`, 's');
  const simpleMatch = prompt.match(simpleRegex);

  if (simpleMatch) {
    return simpleMatch[1].trim();
  }

  // Try parameter format: <parameter name="title">value</parameter>
  const paramRegex = new RegExp(`<parameter name="${paramName}">(.*?)</parameter>`, 's');
  const paramMatch = prompt.match(paramRegex);

  if (paramMatch) {
    return paramMatch[1].trim();
  }

  if (prompt && prompt.length) {
    return `NO TOOL INVOCATION: ${prompt}`;
  }
  return `No ${paramName} provided`;
}

module.exports = {
  langPrompt,
  titleInstruction,
  createTitlePrompt,
  titleFunctionPrompt,
  parseParamFromPrompt,
  genTranslationPrompt,
};
