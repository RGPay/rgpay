package com.rgpay.pos.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class RestaurantData(
    val id: String = "",
    val name: String = "",
    val restaurantName: String = "",
    val address: String = "",
    val logoUrl: String = ""
)

data class AppState(
    val isAuthenticated: Boolean = false,
    val currentApiKey: String? = null,
    val currentDeviceId: String? = null,
    val restaurantData: RestaurantData = RestaurantData(),
    val isLoading: Boolean = false,
    val error: String? = null
)

class AppViewModel : ViewModel() {
    
    private val _appState = MutableStateFlow(AppState())
    val appState: StateFlow<AppState> = _appState.asStateFlow()
    
    fun setAuthenticated(apiKey: String, deviceId: String) {
        _appState.value = _appState.value.copy(
            isAuthenticated = true,
            currentApiKey = apiKey,
            currentDeviceId = deviceId,
            error = null
        )
    }
    
    fun logout() {
        _appState.value = _appState.value.copy(
            isAuthenticated = false,
            currentApiKey = null,
            currentDeviceId = null
        )
    }
    
    fun setLoading(loading: Boolean) {
        _appState.value = _appState.value.copy(isLoading = loading)
    }
    
    fun setError(error: String?) {
        _appState.value = _appState.value.copy(error = error)
    }
    
    fun clearError() {
        _appState.value = _appState.value.copy(error = null)
    }
    
    // Métodos para gerenciar dados do restaurante
    fun setRestaurantData(restaurantData: RestaurantData) {
        _appState.value = _appState.value.copy(
            restaurantData = restaurantData
        )
    }
    
    fun updateRestaurantName(name: String) {
        _appState.value = _appState.value.copy(
            restaurantData = _appState.value.restaurantData.copy(
                restaurantName = name
            )
        )
    }
    
    fun updateRestaurantAddress(address: String) {
        _appState.value = _appState.value.copy(
            restaurantData = _appState.value.restaurantData.copy(
                address = address
            )
        )
    }
    
    fun updateRestaurantLogo(logoUrl: String) {
        _appState.value = _appState.value.copy(
            restaurantData = _appState.value.restaurantData.copy(
                logoUrl = logoUrl
            )
        )
    }
    
    fun getRestaurantName(): String {
        return _appState.value.restaurantData.restaurantName
    }
    
    fun getRestaurantAddress(): String {
        return _appState.value.restaurantData.address
    }
    
    fun getRestaurantLogo(): String {
        return _appState.value.restaurantData.logoUrl
    }
}
