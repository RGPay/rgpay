package com.rgpay.pos.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class AppState(
    val isAuthenticated: Boolean = false,
    val currentApiKey: String? = null,
    val currentDeviceId: String? = null,
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
}
