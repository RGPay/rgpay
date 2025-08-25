package com.rgpay.pos.features.registrations.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rgpay.pos.features.registrations.domain.DeviceRegistrationUseCase
import com.rgpay.pos.features.registrations.clients.DeviceMetadata
import com.rgpay.pos.core.errors.RgPayError
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class DeviceRegistrationState(
    val isLoading: Boolean = false,
    val deviceData: DeviceMetadata? = null,
    val error: String? = null,
    val isSuccess: Boolean = false
)

class DeviceRegistrationViewModel(
    private val useCase: DeviceRegistrationUseCase
) : ViewModel() {
    
    private val _state = MutableStateFlow(DeviceRegistrationState())
    val state: StateFlow<DeviceRegistrationState> = _state.asStateFlow()
    
    fun loadDevice(apiKey: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            try {
                val device = useCase.getDevice(apiKey)
                _state.value = _state.value.copy(
                    isLoading = false,
                    deviceData = device
                )
            } catch (e: RgPayError) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = "Erro inesperado: ${e.message}"
                )
            }
        }
    }
    
    fun assignDevice(apiKey: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            
            try {
                val device = useCase.assignDevice(apiKey)
                _state.value = _state.value.copy(
                    isLoading = false,
                    deviceData = device,
                    isSuccess = true
                )
            } catch (e: RgPayError) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message
                )
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = "Erro inesperado: ${e.message}"
                )
            }
        }
    }
    
    fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
    
    fun resetSuccess() {
        _state.value = _state.value.copy(isSuccess = false)
    }
}
