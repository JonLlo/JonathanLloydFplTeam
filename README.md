## Documentation
- [Feasibility Report](feasibility.md)
- [Requirements Analysis](requirements.md)
- [Design Document](design.md)

## Branching Strategy

To keep the FPL project organized, we use separate branches for different areas of work. All branches are created off `main`.  

| Branch Name       | Purpose                     | Example Use                                   |
|------------------|----------------------------|---------------------------------------------|
| `backend-setup`   | Backend API and endpoints  | `/api/mini-league`, `/api/chatbot`, database integration |
| `frontend-setup`  | React UI setup             | Page structure, navigation, initial charts  |
| `ai-integration`  | AI chatbot                 | Connect OpenAI or ML model to backend       |
| `feature/<name>`  | Specific feature development | `feature/mini-league-graph`, `feature/user-auth` |

### Workflow
1. Create a branch off `main`:
```bash
git checkout main
git checkout -b <branch-name>
