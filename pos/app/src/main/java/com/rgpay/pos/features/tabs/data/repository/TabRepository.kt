package com.rgpay.pos.features.tabs.data.repository

import com.rgpay.pos.features.tabs.data.models.RestaurantTabModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class TabRepository {

    private val _tabs = MutableStateFlow<List<RestaurantTabModel>>(emptyList())
    val tabs: StateFlow<List<RestaurantTabModel>> = _tabs.asStateFlow()

    fun createTab(tableId: String? = null, numberOfPayers: Int? = null): RestaurantTabModel {
        val newTab = RestaurantTabModel(
            tableId = tableId,
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
        val index = currentTabs.indexOfFirst { it.tableId == updatedTab.tableId }

        if (index != -1) {
            currentTabs[index] = updatedTab
            _tabs.value = currentTabs
        }
    }

    fun getTabByTableId(tableId: String): RestaurantTabModel? {
        return _tabs.value.find { it.tableId == tableId }
    }

    fun getAllTabs(): List<RestaurantTabModel> {
        return _tabs.value
    }

    fun deleteTab(tableId: String) {
        val currentTabs = _tabs.value.toMutableList()
        currentTabs.removeAll { it.tableId == tableId }
        _tabs.value = currentTabs
    }

    fun getActiveTabs(): List<RestaurantTabModel> {
        return _tabs.value.filter { !it.isCancelled }
    }

    fun getCancelledTabs(): List<RestaurantTabModel> {
        return _tabs.value.filter { it.isCancelled }
    }
}
