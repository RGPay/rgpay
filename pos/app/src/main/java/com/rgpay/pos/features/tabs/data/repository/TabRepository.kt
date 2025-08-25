package com.rgpay.pos.features.tabs.data.repository

import com.rgpay.pos.features.tabs.data.models.RestaurantTabModel
import com.rgpay.pos.features.tabs.data.models.TabItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.math.BigDecimal

class TabRepository {
    
    private val _tabs = MutableStateFlow<List<RestaurantTabModel>>(emptyList())
    val tabs: StateFlow<List<RestaurantTabModel>> = _tabs.asStateFlow()
    
    fun createTab(tableNumber: String? = null, numberOfPayers: Int? = null): RestaurantTabModel {
        val newTab = RestaurantTabModel(
            tableNumber = tableNumber,
            numberOfPayers = numberOfPayers,
            items = emptyList()
        )
        
        val currentTabs = _tabs.value.toMutableList()
        currentTabs.add(newTab)
        _tabs.value = currentTabs
        
        return newTab
    }
    
    fun updateTab(updatedTab: RestaurantTabModel) {
        val currentTabs = _tabs.value.toMutableList()
        val index = currentTabs.indexOfFirst { it.tableNumber == updatedTab.tableNumber }
        
        if (index != -1) {
            currentTabs[index] = updatedTab
            _tabs.value = currentTabs
        }
    }
    
    fun getTabByTableNumber(tableNumber: String): RestaurantTabModel? {
        return _tabs.value.find { it.tableNumber == tableNumber }
    }
    
    fun getAllTabs(): List<RestaurantTabModel> {
        return _tabs.value
    }
    
    fun deleteTab(tableNumber: String) {
        val currentTabs = _tabs.value.toMutableList()
        currentTabs.removeAll { it.tableNumber == tableNumber }
        _tabs.value = currentTabs
    }
    
    fun getActiveTabs(): List<RestaurantTabModel> {
        return _tabs.value.filter { !it.isCancelled }
    }
    
    fun getCancelledTabs(): List<RestaurantTabModel> {
        return _tabs.value.filter { it.isCancelled }
    }
}
