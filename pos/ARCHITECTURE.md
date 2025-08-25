# RGPay POS - Clean Architecture

Este documento descreve a estrutura de arquitetura limpa implementada no aplicativo RGPay POS.

## Estrutura de Diretórios

```
app/src/main/java/com/rgpay/pos/
├── AppNavigation.kt
├── MainActivity.kt
├── RgpayApp.kt
│
├── core/                           # Camada de infraestrutura compartilhada
│   ├── di/                        # Injeção de dependência global
│   │   └── AppModule.kt
│   ├── errors/                    # Exceções/erros compartilhados
│   │   └── errors.kt
│   ├── network/                   # Clientes HTTP/RTSP/etc
│   │   └── HttpClient.kt
│   ├── ui/                        # Temas e componentes genéricos
│   │   ├── screens/
│   │   │   └── WelcomeScreen.kt
│   │   └── theme/
│   │       ├── Color.kt
│   │       ├── Theme.kt
│   │       └── Type.kt
│   └── utils/                     # Helpers, extensões, formatadores
│       ├── CurrencyFormatter.kt
│       └── ValidationUtils.kt
│
├── viewmodel/                     # ViewModels globais (auth, sessão, appState)
│   └── AppViewModel.kt
│
└── features/                      # Funcionalidades da aplicação
    ├── registrations/             # Registro de dispositivos
    │   ├── data/                  # Models, DTOs
    │   │   └── DeviceMetadataModel.kt
    │   ├── domain/                # UseCases e regras de negócio
    │   │   └── DeviceRegistrationUseCase.kt
    │   ├── presentation/          # Screens + ViewModels
    │   │   ├── ApiKeyScreen.kt
    │   │   ├── DeviceRegistrationScreen.kt
    │   │   └── DeviceRegistrationViewModel.kt
    │   └── clients/               # API client específico
    │       └── DeviceApiClient.kt
    │
    ├── tabs/                      # Gestão de comandas
    │   ├── data/
    │   │   ├── models/            # RestaurantTab, TabItem
    │   │   │   └── RestaurantTab.kt
    │   │   └── repository/        # Repositório de tabs
    │   │       └── TabRepository.kt
    │   ├── domain/                # Lógica de negócio
    │   │   └── TabUseCase.kt
    │   ├── presentation/          # UI (screens, composables) + ViewModel
    │   └── mappers/               # Mapeamento DTO ↔ Domain
    │
    └── locations/                 # Gestão de localizações
        ├── data/
        ├── domain/
        └── presentation/
```

## Princípios da Arquitetura

### 1. Separação de Responsabilidades
- **Core**: Infraestrutura compartilhada, utilitários, temas
- **Features**: Funcionalidades específicas da aplicação
- **ViewModels**: Gerenciamento de estado global

### 2. Clean Architecture
Cada feature segue a estrutura:
- **Data**: Models, DTOs, repositórios, clients
- **Domain**: UseCases, regras de negócio
- **Presentation**: UI, ViewModels, screens

### 3. Injeção de Dependência
- Uso do Hilt para DI
- Módulos organizados por camada
- Dependências injetadas via construtor

### 4. Fluxo de Dados
```
UI → ViewModel → UseCase → Repository → DataSource
```

## Benefícios

1. **Testabilidade**: Cada camada pode ser testada independentemente
2. **Manutenibilidade**: Código organizado e fácil de navegar
3. **Escalabilidade**: Novas features seguem o mesmo padrão
4. **Reutilização**: Componentes core podem ser reutilizados
5. **Flexibilidade**: Fácil troca de implementações

## Convenções

- **Nomenclatura**: PascalCase para classes, camelCase para funções
- **Pacotes**: Seguir estrutura de diretórios
- **Imports**: Organizados por camada (core → features)
- **Documentação**: Comentários em português para regras de negócio
