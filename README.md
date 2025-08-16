# rgpay
RGPay is a credit card machine payment system focused on bars.

## Prerequisites

Before setting up the project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)

### PostgreSQL Installation

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use Chocolatey: `choco install postgresql`

**macOS:**
- Homebrew: `brew install postgresql`
- Or download from: https://www.postgresql.org/download/macosx/

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postgresql postgresql-contrib libpq-dev

# CentOS/RHEL/Fedora
sudo yum install postgresql postgresql-server postgresql-devel

# Arch
sudo pacman -S postgresql
```

## Quick Start

1. Clone the repository
2. Run `./install-dependencies.sh` to install all dependencies
3. Set up your environment variables (see backend/.env.example)
4. Start the development servers

For detailed setup instructions, see the README files in the `backend/` and `frontend/` directories.
