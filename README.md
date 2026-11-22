# Ricardo Baldrez · Portfólio

Portfólio pessoal de **Ricardo Baldrez**, desenvolvedor front-end e mobile. Feito com [Astro](https://astro.build) e TypeScript, sem bibliotecas de animação: todo o movimento é CSS e JavaScript.

## Destaques

- **Abertura em "blueprint"**: o wireframe da página se desenha antes do conteúdo aparecer.
- **Túnel de projetos** com perspectiva calculada em JavaScript e canvas, e cards que viram para mostrar o estudo de caso.
- **Timeline de experiência** que se desenha com o scroll.
- **Terminal** com comandos (`help`, `whoami`, `theme`, `translate`, `sudo hire`…).
- **Temas**: escuro "neon", claro "grafite", cor de destaque configurável e tema minimal.
- **Português e inglês**, pelo botão PT | EN ou pelo comando `translate`.
- **Acessibilidade**: respeita a preferência de reduzir movimento, tem link para pular para o conteúdo e navegação por teclado.

## Rodando localmente

Requer Node 18.20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:4321.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera o site estático em `dist/` |
| `npm run preview` | serve o build localmente |
| `npm run check` | checagem de tipos do Astro |

## Estrutura

```text
src/
├── components/          # partes da página (abertura, menu, terminal, dock…)
│   └── sections/        # seções: Hero, About, Experience, Projects, SideProjects, Keywords, Contact
├── data/                # experiências, projetos e logos (TypeScript)
├── i18n/                # traduções para inglês
├── layouts/             # layout base com os scripts que rodam antes da página aparecer
├── pages/               # index.astro
├── scripts/             # interações (scroll, túnel, terminal, temas, idioma)
└── styles/              # CSS global
public/                  # imagens e favicon
```

## Próximos passos

- Converter os scripts de interação para módulos TypeScript tipados.
- Renderizar a timeline e os projetos no servidor (HTML pronto para SEO).
- Versão em inglês com endereço próprio (`/en`).
- Imagem de prévia para compartilhamento e deploy na Vercel.
