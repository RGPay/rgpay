package com.rgpay.pos.features.tabs.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rgpay.pos.core.network.HttpClient
import com.rgpay.pos.features.tabs.clients.TabsApiClient
import com.rgpay.pos.features.tabs.data.models.RestaurantTabModel
import com.rgpay.pos.features.tabs.data.models.TabItem
import com.rgpay.pos.features.tabs.data.repository.TabRepository
import com.rgpay.pos.features.tabs.domain.TabUseCase
import com.rgpay.pos.features.tabs.mappers.TabMapper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.math.BigDecimal

sealed class TabsListUiState {
    object Loading : TabsListUiState()
    data class Success(
        val tabs: List<RestaurantTabModel>,
        val openTabsCount: Int,
        val paidTabsCount: Int
    ) : TabsListUiState()
    data class Error(
        val message: String,
        val retryAction: () -> Unit
    ) : TabsListUiState()
}

class TabsListViewModel : ViewModel() {
    
    // Dependências - serão injetadas via Hilt posteriormente
    private val tabRepository = TabRepository()
    private val tabUseCase = TabUseCase()
    private val tabsApiClient = TabsApiClient(HttpClient())
    private val tabMapper = TabMapper
    
    private val _uiState = MutableStateFlow<TabsListUiState>(TabsListUiState.Loading)
    val uiState: StateFlow<TabsListUiState> = _uiState.asStateFlow()

    init {
        loadTabs()
    }

        private fun loadTabs() {
        viewModelScope.launch {
            _uiState.value = TabsListUiState.Loading
            
            try {
                // Buscar dados da API
                val apiTabs = tabsApiClient.getTabs()
                val domainTabs = tabMapper.mapApiListToDomain(apiTabs)
                
                // Filtrar apenas comandas ativas e ordenar
                val activeTabs = domainTabs
                    .filter { !it.isCancelled }
                    .sortedWith(compareBy<RestaurantTabModel> { it.isPaid }.thenBy { it.tableId })
                
                val openTabs = activeTabs.filter { !it.isPaid }
                val paidTabs = activeTabs.filter { it.isPaid }
                
                _uiState.value = TabsListUiState.Success(
                    tabs = activeTabs,
                    openTabsCount = openTabs.size,
                    paidTabsCount = paidTabs.size
                )
            } catch (e: Exception) {
                _uiState.value = TabsListUiState.Error(
                    message = "Erro ao carregar comandas: ${e.message}",
                    retryAction = { loadTabs() }
                )
            }
        }
    }



        fun refreshTabs() {
        loadTabs()
    }
    
    fun retry() {
        loadTabs()
    }
    
    fun deleteTab(tab: RestaurantTabModel) {
        viewModelScope.launch {
            try {
                // TODO: Implementar delete via API
                loadTabs() // Recarregar lista
            } catch (e: Exception) {
                _uiState.value = TabsListUiState.Error(
                    message = "Erro ao deletar comanda: ${e.message}",
                    retryAction = { loadTabs() }
                )
            }
        }
    }
}
