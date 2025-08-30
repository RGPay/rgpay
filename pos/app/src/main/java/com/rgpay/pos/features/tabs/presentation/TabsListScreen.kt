package com.rgpay.pos.features.tabs.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.rgpay.pos.core.ui.theme.*
import com.rgpay.pos.features.tabs.data.models.RestaurantTabModel
import com.rgpay.pos.features.tabs.data.models.TabItem
import com.rgpay.pos.viewmodel.AppViewModel
import java.math.BigDecimal

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TabsListScreen(
    navController: NavController,
    appViewModel: AppViewModel,
    onMenuClick: () -> Unit = {},
    onHomeClick: () -> Unit = {},
    onTabsClick: () -> Unit = {},
    onManageTabClick: (RestaurantTabModel) -> Unit = {}
) {
    val tabsViewModel: TabsListViewModel = viewModel()
    val uiState by tabsViewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Comandas",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onMenuClick) {
                        Icon(
                            imageVector = Icons.Default.Menu,
                            contentDescription = "Menu"
                        )
                    }
                },
                actions = {
                    // Logo RGPAY
                    Card(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.linearGradient(
                                        colors = listOf(
                                            RgpayPrimary,
                                            RgpaySecondary
                                        )
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "RG",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onPrimary,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            )
        },
        bottomBar = {
            BottomAppBar(
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    // Botão Home
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.weight(1f)
                    ) {
                        IconButton(onClick = onHomeClick) {
                            Icon(
                                imageVector = Icons.Default.Home,
                                contentDescription = "Home",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            text = "Home",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Botão Comandas (ativo)
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.weight(1f)
                    ) {
                        IconButton(onClick = onTabsClick) {
                            Icon(
                                imageVector = Icons.Default.Receipt,
                                contentDescription = "Comandas",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                        Text(
                            text = "Comandas",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
                Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            val currentUiState = uiState
            when (currentUiState) {
                is TabsListUiState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            CircularProgressIndicator()
                            Text(
                                text = "Carregando comandas...",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
                
                is TabsListUiState.Success -> {
                    if (currentUiState.tabs.isEmpty()) {
                        // Empty state
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                Text(
                                    text = "Nenhuma comanda ativa",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = "Crie uma nova comanda para começar",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    } else {
                        // Lista de comandas
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            // Separar comandas abertas e pagas
                            val openTabs = currentUiState.tabs.filter { !it.isPaid }
                            val paidTabs = currentUiState.tabs.filter { it.isPaid }
                            
                            // Seção: Comandas em Aberto
                            if (openTabs.isNotEmpty()) {
                                item {
                                    Text(
                                        text = "Comandas em Aberto (${currentUiState.openTabsCount})",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.padding(vertical = 8.dp)
                                    )
                                }
                                
                                items(openTabs) { tab ->
                                    TabCard(
                                        tab = tab,
                                        onManageClick = { onManageTabClick(tab) }
                                    )
                                }
                            }
                            
                            // Seção: Comandas Pagas
                            if (paidTabs.isNotEmpty()) {
                                item {
                                    Text(
                                        text = "Comandas Pagas (${currentUiState.paidTabsCount})",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
                                    )
                                }
                                
                                items(paidTabs) { tab ->
                                    TabCard(
                                        tab = tab,
                                        onManageClick = { onManageTabClick(tab) }
                                    )
                                }
                            }
                        }
                    }
                }
                
                is TabsListUiState.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.errorContainer
                            ),
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(16.dp),
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = "Erro ao carregar comandas",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onErrorContainer,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = currentUiState.message,
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onErrorContainer,
                                    textAlign = TextAlign.Center
                                )
                                Button(
                                    onClick = currentUiState.retryAction,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = MaterialTheme.colorScheme.error
                                    )
                                ) {
                                    Text("Tentar novamente")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TabCard(
    tab: RestaurantTabModel,
    onManageClick: () -> Unit
) {
    // Determinar o status da comanda
    val tabStatus = when {
        tab.isCancelled -> TabStatus.CANCELLED
        tab.isPaid -> TabStatus.PAID
        else -> TabStatus.OPEN
    }
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = when (tabStatus) {
                TabStatus.PAID -> MaterialTheme.colorScheme.surface
                TabStatus.CANCELLED -> MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.1f)
                TabStatus.OPEN -> MaterialTheme.colorScheme.surface
            }
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Informações da comanda
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Comanda XYZ - ${tab.tableId ?: "Mesa não registrada"}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    
                    // Ícone de status
                    Icon(
                        imageVector = when (tabStatus) {
                            TabStatus.PAID -> Icons.Default.CheckCircle
                            TabStatus.CANCELLED -> Icons.Default.Cancel
                            TabStatus.OPEN -> Icons.Default.Schedule
                        },
                        contentDescription = when (tabStatus) {
                            TabStatus.PAID -> "Paga"
                            TabStatus.CANCELLED -> "Cancelada"
                            TabStatus.OPEN -> "Aberta"
                        },
                        tint = when (tabStatus) {
                            TabStatus.PAID -> RgpaySuccess
                            TabStatus.CANCELLED -> MaterialTheme.colorScheme.error
                            TabStatus.OPEN -> MaterialTheme.colorScheme.primary
                        },
                        modifier = Modifier.size(20.dp)
                    )
                }

                if (tab.numberOfPayers != null) {
                    Text(
                        text = "${tab.numberOfPayers} pagantes",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Total: ${tab.total}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = when (tabStatus) {
                            TabStatus.PAID -> RgpaySuccess
                            TabStatus.CANCELLED -> MaterialTheme.colorScheme.error
                            TabStatus.OPEN -> MaterialTheme.colorScheme.primary
                        }
                    )
                    
                    // Status badge
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = when (tabStatus) {
                                TabStatus.PAID -> RgpaySuccess.copy(alpha = 0.1f)
                                TabStatus.CANCELLED -> MaterialTheme.colorScheme.error.copy(alpha = 0.1f)
                                TabStatus.OPEN -> MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                            }
                        ),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = when (tabStatus) {
                                TabStatus.PAID -> "PAGA"
                                TabStatus.CANCELLED -> "CANCELADA"
                                TabStatus.OPEN -> "ABERTA"
                            },
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = when (tabStatus) {
                                TabStatus.PAID -> RgpaySuccess
                                TabStatus.CANCELLED -> MaterialTheme.colorScheme.error
                                TabStatus.OPEN -> MaterialTheme.colorScheme.primary
                            },
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            // Botão Gerir (desabilitado para comandas pagas ou canceladas)
            Button(
                onClick = onManageClick,
                shape = CircleShape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = when (tabStatus) {
                        TabStatus.PAID -> MaterialTheme.colorScheme.onSurfaceVariant
                        TabStatus.CANCELLED -> MaterialTheme.colorScheme.onSurfaceVariant
                        TabStatus.OPEN -> RgpayPrimary
                    }
                ),
                enabled = tabStatus == TabStatus.OPEN,
                modifier = Modifier.size(48.dp)
            ) {
                Text(
                    text = "Gerir",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

enum class TabStatus {
    OPEN, PAID, CANCELLED
}

@Preview(showBackground = true)
@Composable
fun TabsListScreenPreview() {
    RgpayTheme {
        TabsListScreen(
            navController = rememberNavController(),
            appViewModel = viewModel()
        )
    }
}

@Preview(showBackground = true)
@Composable
fun TabCardPreview() {
    RgpayTheme {
        Column(
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(16.dp)
        ) {
            // Comanda aberta
            TabCard(
                tab = RestaurantTabModel(
                    tableId = "Mesa 01",
                    numberOfPayers = 2,
                    items = emptyList()
                ),
                onManageClick = {}
            )
            
            // Comanda parcialmente paga (aberta)
            TabCard(
                tab = RestaurantTabModel(
                    tableId = "Mesa 01",
                    numberOfPayers = 2,
                    items = listOf(
                        TabItem("X-Burger", BigDecimal("15.90"), "1", 2, 1),
                        TabItem("Refrigerante", BigDecimal("5.50"), "2", 2, 2)
                    )
                ),
                onManageClick = {}
            )
            
            // Comanda paga
            TabCard(
                tab = RestaurantTabModel(
                    tableId = "Mesa Pikachu",
                    numberOfPayers = 4,
                    items = listOf(
                        TabItem("X-Burger", BigDecimal("15.90"), "1", 2, 2),
                        TabItem("Refrigerante", BigDecimal("5.50"), "2", 2, 2)
                    )
                ),
                onManageClick = {}
            )
        }
    }
}
