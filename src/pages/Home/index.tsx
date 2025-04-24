import { HandPalm, Play } from 'phosphor-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';
import { useContext } from 'react';
import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import { CycleContext } from '../../contexts/CyclesContext';

// inputs controlled: guarda em tempo real a informação do input do usuário guardada no estado da nossa aplicação
//input uncontrolled: busca a informação do valor do input apenas quando precisar dela

/**
 *  Prop Drilling -> Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes
 *  Context API -> Permite compartilharmos informações entre VÁRIOS componentes ao mesmo tempo
 */

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const {createNewCycle, interruptCurrentCycle, activeCycle} = useContext(CycleContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, reset, watch } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
