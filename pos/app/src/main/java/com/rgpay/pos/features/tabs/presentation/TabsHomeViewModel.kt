package com.rgpay.pos.features.tabs.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rgpay.pos.features.tabs.domain.TabUseCase
import com.rgpay.pos.features.tabs.data.repository.TabRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class TabsHomeState(
    val isLoading: Boolean = false,
    val totalTabs: Int = 0,
    val activeTabs: Int = 0,
    val restaurantName: String = "Lorem ipsum Lanches",
    val error: String? = null
)

class TabsHomeViewModel(
    private val tabUseCase: TabUseCase,
    private val tabRepository: TabRepository
) : ViewModel() {
    
    private val _state = MutableStateFlow(TabsHomeState())
    val state: StateFlow<TabsHomeState> = _state.asStateFlow()
    
    init {
        loadTabsSummary()
    }
    
    private fun loadTabsSummary() {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true)
            
            try {
                val allTabs = tabRepository.getAllTabs()
                val activeTabs = tabRepository.getActiveTabs()
                
                _state.value = _state.value.copy(
                    isLoading = false,
                    totalTabs = allTabs.size,
                    activeTabs = activeTabs.size
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = "Erro ao carregar comandas: ${e.message}"
                )
            }
        }
    }
    
    fun refreshData() {
        loadTabsSummary()
    }
    
    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
    
    fun getRestaurantName(): String {
        return _state.value.restaurantName
    }
}
